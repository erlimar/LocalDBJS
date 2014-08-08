/**
 * LocalDB v0.1
 *
 * Biblioteca JavaScript simples para armazenamento de dados locais.
 *
 * Copyright (C) 2014 Erlimar Silva Campos (erlimar@gmail.com)
 *
 * License: MIT
 */

(function (global) { 'use strict';
    var undefined = arguments[arguments.length];

    // JSON é requerido
    if (global['JSON'] == undefined) {
        throw Error('SPADB requer o objeto global JSON.');
    }

    // Mock da especificação W3C `Web Storage`, http://dev.w3.org/html5/webstorage.
    var mockW3CWebStorage = {
        setItem: function () { },
        getItem: function () { return null },
        removeItem: function () { },
        __isMock__: true
    };

    var localStorage = global.localStorage || mockW3CWebStorage;
    var sessionStorage = global.sessionStorage || mockW3CWebStorage;

    // Por padrão os dados não são persistidos no navegador além da sessão atual
    var currentStorage = sessionStorage;
    var persistData = false;

    // <summary>
    // Serializa os dados para armazenamento local
    // </summary>
    var serializeData = function (data) {
        return JSON.stringify(data);
    }

    // <summary>
    // Deserializa os dados para armazenamento local
    // </summary>
    var deserializeData = function (data) {
        return JSON.parse(data);
    }

    var localDB = {
        setItem: function (key, value) {
            if (currentStorage.__isMock__) {
                return;
            }
            var data = serializeData(value);
            currentStorage.setItem(key, data);
        },
        getItem: function (key) {
            var data = currentStorage.getItem(key);
            if (!currentStorage.__isMock__) {
                data = deserializeData(data);
            }
            return data;
        },
        removeItem: function (key) {
            currentStorage.removeItem(key);
        }
    };

    // Banco de dados
    var db = [];

    // <summary>
    // Retorna o INDEX de uma chave no banco de dados. Se não existir retorna -1.
    // </summary>
    var indexKey = function (key) {
        for (var i = 0; i < db.length; i++) {
            var record = db[i];
            if (record && record.key && record.key == key) {
                return i;
            }
        }
        return -1;
    }

    // <summary>
    // Retorna um valor do banco de dados de acordo com a KEY informada, ou
    // NULL se não existir.
    // </summary>
    var getValue = function (key) {
        for (var i = 0; i < db.length; i++) {
            var record = db[i];
            if (record && record.key && record.key == key) {
                return restoreObject(record.value);
            }
        }
        // Uma última alternativa é tentar obter o valor do banco local, se
        // existir o recurso.
        try {
            return localDB.getItem(key);
        } catch (noError) {
            // Sem sinalização de erros
            return null;
        }
    }

    // <summary>
    // Atribui um valor no banco de dados. Se já existir, substitui. Se não
    // existir, cria um novo.
    // </summary>
    var setValue = function (key, value) {
        var index = indexKey(key);
        var record = { key: key };
        if (0 > index) {
            db.push(record);
        } else {
            record = db[index];
        }
        record.value = copyObject(value);
        // Tentamos salvar os dados no banco local, se existir o recurso
        try {
            localDB.setItem(record.key, record.value);
        } catch (noError) {
            // Sem sinalização de erros
        }
    }

    // <summary>
    // Remove um valor do banco de dados, se existir.
    // </summary>
    var removeValue = function (key) {
        var index = indexKey(key);
        if (0 > index) {
            return;
        }
        db.splice(index, 1);
        // Tentamos remover os dados do banco local também, se existir o
        // recurso
        try {
            localDB.removeItem(key);
        } catch (noError) {
            // Sem sinalização de erros
        }
    }

    // <summary>
    // Copia a estrutura de um objeto, para um novo objeto.
    //
    // NOTA: Este método é utilizado para que não sejam guardadas referências
    //       no banco de dados, pois o uso de referências implica que toda a
    //       alteração das referências também reflitam no banco, e não é esse
    //       o objetivo desta implementação.
    //
    //       O objetivo desta implementação é guardar o estado de um objeto,
    //       uma vez o mesmo SALVO, pode ser modificado sem refletir no estado
    //       salvo anteriormente.
    // </summary>
    var copyObject = function (object) {
        var newObject = {};
        for (var prop in object) {
            var propName = '__' + prop + '__';
            var propValue = object[prop];
            newObject[propName] = propValue;
        }
        return newObject;
    }

    // <summary>
    // Restaura os valores de um objeto copiado com `copyObject`. Usado normalmente
    // por `getValue`.
    // </summary>
    var restoreObject = function (object) {
        var restoredObject = {};
        for (var prop in object) {
            var propName = prop.substring(2, prop.length - 2);
            var propValue = object[prop];
            restoredObject[propName] = propValue;
        }
        return restoredObject;
    }

    // <summary>
    // Obtém e/ou atribui valor para `persistData`
    // </summary>
    var getterSetterPersistData = function(newValue) {
        if(newValue != undefined) {
            persistData = newValue
                ? true
                : false;
            if (persistData) {
                currentStorage = localStorage;
            } else {
                currentStorage = sessionStorage;
            }
        }
        return persistData;
    };

    // Registrando o componente global `localDB`
    global['localDB'] = {
        save: setValue,
        read: getValue,
        remove: removeValue,
        persistData: getterSetterPersistData
    };
})(window);
