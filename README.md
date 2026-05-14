# 💍 Natacha & Mauricio — Site de Casamento

Site de casamento completo, moderno e emocional. Construído com **Next.js 16**, **TypeScript**, **TailwindCSS v4**, **Framer Motion**, **Firebase** e **Mercado Pago**.

---

## ✨ Funcionalidades

- **Hero** cinematográfico com countdown em tempo real
- **Nossa História** — storytelling com timeline e parallax
- **Manual dos Convidados** — cards elegantes com regras
- **Lista de Presentes** — mosaico com filtros, busca, checkout via Mercado Pago e PIX
- **Mural de Recados** — tempo real via Firestore
- **Confirmar Presença** — busca fuzzy na lista de convidados
- **Player de música** flutuante com mute/unmute
- **Partículas** douradas animadas no fundo
- **Navbar** com scroll transparente e menu mobile
- **Loading screen** cinematográfica

---

## 🚀 Como rodar localmente

### 1. Clone e instale dependências

```bash
git clone <seu-repositorio>
cd married
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com suas credenciais do Firebase e do Mercado Pago (veja seções abaixo).

### 3. Adicione a música

Coloque um arquivo `.mp3` em `public/music/romantic.mp3`.

Sugestões gratuitas: [Pixabay Music](https://pixabay.com/music/search/romantic/) (filtre por "romantic" ou "wedding").

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔥 Como configurar o Firebase

### 1. Crie um projeto no Firebase

Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um novo projeto.

### 2. Ative o Firestore

- No menu lateral: **Firestore Database** → **Criar banco de dados**
- Escolha modo de teste (para desenvolvimento) ou configure as regras de segurança.

### 3. Registre um app Web

- Clique no ícone `</>` na página inicial do projeto
- Copie o objeto `firebaseConfig`

### 4. Preencha o `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

### 5. Regras de segurança do Firestore (mínimo recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Mural de recados
    match /messages/{doc} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.text is string;
    }
    // Convidados — seed + RSVP + painel dos noivos
    match /guests/{guestId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> Firebase é opcional. Sem as variáveis configuradas, o mural de recados e o RSVP funcionam em modo degradado (sem persistência).

> A coleção `guests` precisa de `write: true` para o script `seed:guests` e para os convidados confirmarem presença via RSVP.

---

## 💳 Como configurar o Mercado Pago

O site usa **Checkout Pro** do Mercado Pago — sem expor credenciais no frontend.

### 1. Crie uma conta de desenvolvedor

Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) e faça login com sua conta do Mercado Pago.

### 2. Crie um aplicativo

- Vá em **Seus aplicativos** → **Criar aplicativo**
- Tipo: **Checkout Pro**
- Anote o **Public Key** e o **Access Token** (use os de **produção** para o site real, ou os de **teste** para desenvolvimento)

### 3. Preencha o `.env.local`

```env
# Mercado Pago
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-0000000000000000-000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000

# URL do site (sem barra no final)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Chave PIX para cópia manual
NEXT_PUBLIC_PIX_KEY=seu@email.com
```

> Em produção, substitua `NEXT_PUBLIC_SITE_URL` pela URL do seu domínio (ex: `https://natachaemauricio.com.br`).

### 4. Como funciona

| Ação | Fluxo |
|------|-------|
| Convidado clica "Dar" em um presente | `POST /api/create-preference` com `{ type: 'gift', id }` → servidor busca preço real em `gifts.json` → cria preferência no MP → redireciona para checkout |
| Convidado insere valor e clica "Ir para o Checkout" na seção PIX | `POST /api/create-preference` com `{ type: 'contribution', amount }` → servidor valida R$1–R$50.000 → cria preferência → redireciona |
| Pagamento aprovado | MP redireciona para `/pagamento/sucesso` |
| Pagamento recusado | MP redireciona para `/pagamento/erro` |
| PIX aguardando confirmação | MP redireciona para `/pagamento/pendente` |

> O preço dos presentes é sempre lido do servidor (`mocks/gifts.json`) — nunca do payload do cliente.

### 5. Testando em desenvolvimento

Use as credenciais de **teste** do painel do Mercado Pago. Você pode simular pagamentos com os cartões de teste fornecidos pela documentação do MP.

---

## ☁️ Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório diretamente em [vercel.com](https://vercel.com).

### Variáveis de ambiente na Vercel

Na dashboard do projeto: **Settings → Environment Variables**. Adicione todas as variáveis do `.env.local`:

| Variável | Onde obter |
|----------|-----------|
| `NEXT_PUBLIC_FIREBASE_*` | Console Firebase → Configurações do projeto |
| `MERCADO_PAGO_ACCESS_TOKEN` | Painel MP Developers → Credenciais de produção |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Painel MP Developers → Credenciais de produção |
| `NEXT_PUBLIC_SITE_URL` | URL do seu domínio na Vercel (ex: `https://natachaemauricio.com.br`) |
| `NEXT_PUBLIC_PIX_KEY` | Sua chave PIX (CPF, email, celular ou chave aleatória) |

> Após adicionar as variáveis, faça um novo deploy para que entrem em vigor.

---

## 🌸 Convidados e painel dos noivos

### Popular convidados no Firestore (seed)

Antes de usar o sistema de confirmação de presença, os convidados precisam existir no Firestore.

```bash
npm run seed:guests
```

O script lê `mocks/guests.json` e cria um documento na coleção `guests` para cada convidado. Documentos já existentes são ignorados (sem duplicidade).

### Limpar todas as coleções do Firestore

```bash
npm run firestore:clear
```

Apaga todos os documentos das coleções `guests`, `messages`, `confirmations` e `gifts`. **Irreversível** — o script pede confirmação antes de executar.

### Adicionar ou editar convidados

Edite `mocks/guests.json` e rode `npm run seed:guests` novamente. Apenas os convidados novos serão criados — os existentes não são alterados.

### Painel dos noivos

Acesse `/noivos` no navegador. Você verá um modal de senha elegante.

- **Senha:** `135426`
- O painel mostra estatísticas em tempo real (total, confirmados, pendentes, taxa)
- Countdown até o casamento
- Lista completa de convidados com busca e filtros
- Ações: confirmar, remover confirmação, editar telefone e quantidade de pessoas
- Tudo sincronizado com o Firestore em tempo real

> O acesso ao `/noivos` não é listado na navbar — é para uso interno dos noivos.

---

## 📸 Como adicionar fotos reais do casal

As imagens em `public/images/` são temporárias. Para substituir:

1. Coloque as fotos na pasta `public/images/`
2. Substitua as referências nos componentes:
   - `components/home/Hero.tsx` — foto principal do hero (`book2.png`)
   - `components/home/HistoriaTeaser.tsx` — foto editorial (`book1.png`)
   - `app/historia/page.tsx` — fotos da timeline

---

## 🎵 Como trocar a música

1. Coloque o novo arquivo `.mp3` em `public/music/`
2. Edite `components/audio/MusicPlayer.tsx`:
   ```tsx
   const { playing, toggle } = useAudio('/music/seu-arquivo.mp3')
   ```

---

## 👥 Como editar a lista de convidados

Edite o arquivo `mocks/guests.json`:

```json
[
  { "id": "g001", "name": "Nome do Convidado" },
  ...
]
```

IDs devem ser únicos.

---

## 🎁 Como editar os presentes

Edite o arquivo `mocks/gifts.json`:

```json
[
  {
    "id": "p001",
    "name": "Nome do Presente",
    "description": "Descrição curta",
    "price": 250,
    "image": "https://url-da-imagem.com/foto.jpg",
    "category": "Cozinha",
    "featured": false
  }
]
```

Categorias disponíveis: `Lua de Mel`, `Cozinha`, `Quarto`, `Sala`, `Banheiro`, `Lazer`.

Presentes com `"featured": true` aparecem com imagem maior no mosaico.

---

## 🗂️ Estrutura do projeto

```
app/
├── layout.tsx
├── page.tsx                        # Home (/)
├── historia/page.tsx
├── manual/page.tsx
├── presentes/page.tsx
├── recados/page.tsx
├── confirmar-presenca/page.tsx
├── api/
│   ├── create-preference/route.ts  # Cria preferência no Mercado Pago
│   └── webhook/route.ts            # Placeholder para notificações MP
└── pagamento/
    ├── sucesso/page.tsx
    ├── erro/page.tsx
    └── pendente/page.tsx

components/
├── layout/      # Navbar, Footer, LoadingScreen, BackToTop
├── ui/          # AnimatedSection, SectionTitle, Particles, PageHero
├── home/        # Hero, HistoriaTeaser, StoryCards, LocationSection
├── audio/       # MusicPlayer
├── presentes/   # GiftsClient, PIXSection
├── recados/     # MessageWall
└── confirmar-presenca/ # RSVPClient

lib/
├── firebase.ts
├── firestore.ts
└── mercadopago.ts   # Client MP + createPreference()

hooks/           # useCountdown.ts, useAudio.ts
mocks/           # guests.json, gifts.json
types/           # index.ts
constants/       # index.ts
```

---

Feito com ♥ para Natacha & Mauricio — 01.08.2026
