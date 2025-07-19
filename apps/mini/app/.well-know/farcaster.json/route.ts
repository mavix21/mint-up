// app/.well-known/farcaster.json/route.ts
// Asegúrate de que este archivo sea un "Server Component" o una "API Route"
// en Next.js, por lo tanto, no necesita 'use client'.
import { NextResponse } from 'next/server';

export async function GET() {
  // Asegúrate de que NEXT_PUBLIC_URL esté definido en tus variables de entorno.
  // Es la URL base de tu aplicación desplegada (ej. https://tuminiapp.vercel.app)
  const appUrl = process.env.NEXT_PUBLIC_URL;

  if (!appUrl) {
    // Es crucial que esta variable esté configurada tanto en desarrollo como en producción
    throw new Error('NEXT_PUBLIC_URL environment variable is not defined.');
  }

  // Estas variables de entorno se obtienen al ejecutar 'npx create-onchain --manifest'
  const accountAssociationHeader = process.env.FARCASTER_HEADER;
  const accountAssociationPayload = process.env.FARCASTER_PAYLOAD;
  const accountAssociationSignature = process.env.FARCASTER_SIGNATURE;

  if (!accountAssociationHeader || !accountAssociationPayload || !accountAssociationSignature) {
    // Si alguna de estas no está presente, significa que no has generado la asociación
    // de cuenta o no las has configurado en tus variables de entorno.
    // Recuérdale al usuario cómo generarlas.
    throw new Error(
      'Farcaster manifest account association variables (FARCASTER_HEADER, FARCASTER_PAYLOAD, FARCASTER_SIGNATURE) are not set. Please run `npx create-onchain --manifest` and configure them.'
    );
  }

  // Define el objeto de configuración de tu Mini App Farcaster
  const farcasterConfig = {
    // **accountAssociation es fundamental para verificar la propiedad de la app**
    accountAssociation: {
      header: accountAssociationHeader,
      payload: accountAssociationPayload,
      signature: accountAssociationSignature,
    },
    // **Configuración básica de tu Mini App**
    frame: {
      version: '1', // Versión del protocolo Farcaster Frame. Mantener en "1" por ahora.
      name: 'Mint Up!', // <<-- ¡IMPORTANTE! Cambia esto al nombre de tu app
      iconUrl: `${appUrl}/farcaster-icon.png`, // <<-- ¡IMPORTANTE! URL a tu icono (ej. 200x200px)
      // Asegúrate de tener este icono en tu carpeta `public/`
      // Ej: `public/farcaster-icon.png`
      homeUrl: `${appUrl}`, // URL de inicio de tu Mini App. Normalmente es la raíz.
      // Puedes añadir más campos aquí según la especificación de Farcaster Mini App:
      // splashImageUrl: `${appUrl}/images/splash.png`, // Imagen de bienvenida opcional
      // heroImageUrl: `${appUrl}/images/hero.png`,     // Imagen destacada opcional
      // screenshotUrls: [                            // URLs de capturas de pantalla de tu app
      //   `${appUrl}/images/screenshot1.png`,
      //   `${appUrl}/images/screenshot2.png`,
      // ],
      // description: "Una descripción concisa de mi increíble Mini App.",
    },
    // Si tu Mini App soporta otras características de Farcaster, las defines aquí:
    // actions: { ... },
    // notifications: { ... },
  };

  // Retorna el JSON con las cabeceras correctas
  return NextResponse.json(farcasterConfig, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // Puedes ajustar el caché. Farcaster clientes lo leerán.
    },
  });
}
