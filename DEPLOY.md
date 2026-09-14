# Como publicar o Passo Certo

Guia passo a passo para quem **nunca usou terminal**. Duas etapas: colocar o projeto no GitHub, depois publicar na Vercel. Leva uns 10 minutos, e é tudo de graça.

---

## Parte 1 — Colocar o projeto no GitHub

Se o projeto **já está** num repositório do GitHub (por exemplo, você recebeu este material já dentro de um repositório), pule direto para a [Parte 2](#parte-2--publicar-na-vercel).

### 1. Criar uma conta no GitHub

Acesse [github.com](https://github.com) e crie uma conta gratuita, caso ainda não tenha uma.

### 2. Criar um repositório novo

1. No canto superior direito, clique no **+** e depois em **New repository**.
2. Dê um nome ao repositório — sugestão: `passo-certo`.
3. Deixe como **Public** (assim a Vercel consegue acessá-lo gratuitamente).
4. **Não** marque nenhuma opção de adicionar README, licença ou `.gitignore` — o projeto já traz esses arquivos.
5. Clique em **Create repository**.

### 3. Enviar os arquivos do projeto

Na página do repositório recém-criado, procure o link **uploading an existing file** (ou o botão **Add file → Upload files**).

1. Clique nele.
2. Arraste **todos** os arquivos do projeto para a área indicada:
   - `index.html`
   - `dossie.html`
   - `README.md`
   - `DEPLOY.md`
   - `logo.svg`
   - `logo-monocromatica.svg`
   - `vercel.json`
   - `.gitignore`
3. Role até o fim da página e clique em **Commit changes**.

Pronto — o projeto está no GitHub. Confirme que `index.html` aparece **na raiz** do repositório (não dentro de nenhuma pasta): é de lá que a Vercel vai publicar o site.

---

## Parte 2 — Publicar na Vercel

### 1. Criar uma conta na Vercel

Acesse [vercel.com](https://vercel.com) e clique em **Sign Up**. Escolha **Continue with GitHub** — assim as duas contas já ficam conectadas, e você não precisa criar mais uma senha.

Autorize a Vercel a acessar sua conta do GitHub quando for solicitado.

### 2. Importar o projeto

1. No painel da Vercel, clique em **Add New…** e depois em **Project**.
2. Na lista de repositórios do GitHub, encontre o repositório que você criou (`passo-certo`, ou o nome que você escolheu).
3. Clique em **Import**.

### 3. Configurar e publicar

A Vercel detecta automaticamente que é um site estático — **não é preciso mudar nada** nas configurações que aparecem na tela (Framework Preset pode continuar em "Other").

1. Confira se o **Root Directory** está vazio (ou marcado como `./`) — significa que a Vercel vai procurar o `index.html` na raiz do projeto, que é onde ele está.
2. Clique em **Deploy**.

Em menos de um minuto a Vercel mostra uma tela de confetes com o link do site publicado, algo como:

```
https://passo-certo.vercel.app
```

Esse é o endereço do aplicativo. O arquivo `vercel.json` do projeto já configura as URLs limpas (sem `.html` no final) e dois cabeçalhos de segurança — não é preciso fazer nada a mais.

### 4. Ver o dossiê do projeto

O dossiê fica no mesmo endereço, acrescentando `/dossie`:

```
https://passo-certo.vercel.app/dossie
```

---

## Atualizando o site depois

Sempre que você quiser mudar algo:

1. Edite o arquivo direto no GitHub (abra o arquivo no repositório e clique no ícone de lápis), **ou** repita o processo de **Upload files** da Parte 1 com o arquivo atualizado.
2. Clique em **Commit changes**.
3. A Vercel percebe a mudança automaticamente e publica uma nova versão em menos de um minuto — não é preciso repetir nada na Vercel.

---

## Problemas comuns

**"A Vercel não encontrou nenhum repositório meu."**
Clique em **Adjust GitHub App Permissions**, na própria tela de importação, e autorize o acesso ao repositório específico ou a todos os repositórios da sua conta.

**"O site abriu, mas está tudo desformatado."**
Confirme que `index.html`, `logo.svg` e `logo-monocromatica.svg` foram enviados todos juntos, na raiz do repositório — se algum arquivo faltar, alguns elementos da página não carregam.

**"Quero usar um domínio próprio, tipo `passocerto.com.br`."**
No painel do projeto na Vercel, vá em **Settings → Domains** e siga as instruções para adicionar o seu domínio — a Vercel indica os registros de DNS que você precisa configurar onde comprou o domínio.
