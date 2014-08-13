LocalDB
=======

Biblioteca JavaScript simples para armazenamento de dados locais.

## License: MIT

    Copyright (C) 2014 Erlimar Silva Campos (erlimar@gmail.com)

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in
     all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     THE SOFTWARE.


Uma forma simples para implementar localStorage em suas aplicações [SPA](http://en.wikipedia.org/wiki/Single-page_application) (Single Page Application).

Com ela você tem a segurança de usar o mecanismo mesmo se o browser não tiver suporte. Nesse caso os dados são mantidos em memória.

**NOTA:** Nesse caso um F5 (Refresh) faz com que os dados sejam perdidos. _Mas e daí? É uma SPA mesmo!_

## Incluindo a biblioteca em seus projetos

```html
<script src="localdb.js"></script>
```

## Salvando um objeto

```javascript
localDB.save('Key', { my: object });
```

Caso você queira desconsiderar algumas propriedades do objeto ao salvar:

```javascript
localDB.save('Key', { pub: 'value', priv: 'value private' }, { exclude: ['priv'] });
```

## Recuperando o objeto

```javascript
localDB.read('Key');
```

## Removendo o objeto

```javascript
localDB.remove('Key');
```

## Persistência

Por padrão (quando há suporte pelo Browser) os dados são salvos na sessão. Isso que dizer que quando você fechar a página (ou a aba) e voltar novamente, já era, os dados são perdidos.

Mas você pode informar que deseja persistir os dados além da sessão atual. Para isso basta:

```javascript
localDB.persistData(true);
```

E você pode retornar a qualquer momento:

```javascript
localDB.persistData(false);
```
