# JAVIVI — Tienda online

Cosmética + ropa usada. Next.js 15 + Supabase + Vercel. 100% gratis.

## Correr en local

```bash
cd javivi
npm install
npm run dev
```
Abre http://localhost:3000

## Publicar (deploy) — primer lanzamiento

1. **GitHub:** crea un repo (privado o público) y sube esta carpeta.
   ```bash
   git init
   git add .
   git commit -m "feat: JAVIVI tienda inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/javivi.git
   git push -u origin main
   ```

2. **Vercel:** entra a vercel.com → "Add New Project" → importa el repo.
   - Root Directory: `javivi` (si subiste la carpeta padre) o vacío si subiste solo `javivi`.
   - Framework: Next.js (auto).
   - Variables de entorno: copia las de `.env.example` y completa.

3. **Supabase (opcional ahora, necesario para admin):**
   - Crea proyecto en supabase.com.
   - SQL Editor → pega `supabase-schema.sql` → Run.
   - Storage → crea bucket `product-images` (público) (el SQL ya lo crea).
   - Authentication → crea un usuario (tu email + contraseña) para el admin.
   - Copia `Project URL` y `anon public key` a las env vars de Vercel.

4. **WhatsApp:** en Vercel env, pon `NEXT_PUBLIC_WHATSAPP_NUMBER=56XXXXXXXXX` con tu número real (sin +).

5. **Dominio propio:** en Vercel → Settings → Domains → agrega tu dominio y sigue las instrucciones DNS.

## Estructura

Ver `plan` en `C:\Users\usuario\.opencode\plan\javivi-plan.md` (fuente de verdad).

## Próximas fases

- Fase 2: admin panel (login, CRUD productos, subida de fotos).
- Fase 3: stock automático, promociones, SEO.