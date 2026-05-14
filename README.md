# 💍 Natacha & Mauricio — Site de Casamento

Site de casamento completo, moderno e emocional. Construído com **Next.js 16**, **TypeScript**, **TailwindCSS v4**, **Framer Motion** e **Firebase**.

---

## ✨ Funcionalidades

- **Hero** cinematográfico com countdown em tempo real
- **Nossa História** — storytelling com timeline e parallax
- **Manual dos Convidados** — cards elegantes com regras
- **Lista de Presentes** — grid com filtros, busca e PIX
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

Preencha o `.env.local` com suas credenciais do Firebase (veja seção abaixo).

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

### 3. Ative o Storage (para fotos futuras)

- No menu lateral: **Storage** → **Começar**

### 4. Registre um app Web

- Clique no ícone `</>` na página inicial do projeto
- Copie o objeto `firebaseConfig`

### 5. Preencha o `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123

NEXT_PUBLIC_PIX_KEY=seu@email.com
```

### 6. Regras de segurança do Firestore (mínimo recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{doc} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.text is string;
    }
    match /confirmations/{doc} {
      allow read: if false;
      allow create: if request.resource.data.guestName is string
                    && request.resource.data.email is string;
    }
  }
}
```

---

## ☁️ Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Ou conecte o repositório diretamente em [vercel.com](https://vercel.com).

**Configure as variáveis de ambiente** na dashboard da Vercel (Settings → Environment Variables).

---

## 💳 Integração futura com Mercado Pago

O componente `PIXSection` e os cards de presentes já têm estrutura preparada.

Para integrar:

1. Crie uma conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Adicione ao `.env.local`:
   ```env
   NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
   MP_ACCESS_TOKEN=APP_USR-...
   ```
3. Crie um Route Handler em `app/api/create-preference/route.ts`
4. Use o SDK `@mercadopago/sdk-react` nos componentes de checkout

---

## 📸 Como adicionar fotos reais do casal

As imagens do Unsplash são temporárias. Para substituir:

1. Faça upload das fotos no **Firebase Storage** (ou use qualquer CDN)
2. Substitua as URLs `https://images.unsplash.com/...` nos componentes:
   - `components/home/Hero.tsx` — foto principal do hero
   - `components/home/StoryCards.tsx` — fotos dos cards
   - `app/historia/page.tsx` — fotos da timeline
3. Use o componente `<Image>` do Next.js para otimização automática:
   ```tsx
   import Image from 'next/image'
   <Image src="/foto-casal.jpg" alt="Natacha e Mauricio" fill className="object-cover" />
   ```

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
    "purchased": false
  }
]
```

Categorias disponíveis: `Cozinha`, `Quarto`, `Sala`, `Banheiro`, `Lazer`, `Viagem`, `Surpresa`.

---

## 🗂️ Estrutura do projeto

```
app/
├── layout.tsx
├── page.tsx                   # Home (/)
├── historia/page.tsx
├── manual/page.tsx
├── presentes/page.tsx
├── recados/page.tsx
└── confirmar-presenca/page.tsx

components/
├── layout/      # Navbar, Footer, LoadingScreen, BackToTop
├── ui/          # AnimatedSection, SectionTitle, Particles
├── home/        # Hero, Countdown, StoryCards, LocationSection
├── audio/       # MusicPlayer
├── presentes/   # GiftsClient, PIXSection
├── recados/     # MessageWall
└── confirmar-presenca/ # RSVPClient

lib/             # firebase.ts, firestore.ts
hooks/           # useCountdown.ts, useAudio.ts
mocks/           # guests.json, gifts.json
types/           # index.ts
constants/       # index.ts
```

---

Feito com ♥ para Natacha & Mauricio — 01.08.2026
