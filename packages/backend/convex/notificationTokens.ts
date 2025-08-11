import { v } from 'convex/values';
import { internalQuery, mutation } from './_generated/server';

export const store = mutation({
  // Define los argumentos que la mutación espera recibir desde el cliente
  args: {
    fid: v.string(), // El Farcaster ID del usuario
    notificationUrl: v.string(), // La URL para notificar, proporcionada por MiniKit
    token: v.string(), // El token de autorización, proporcionado por MiniKit
  },

  // El handler es la lógica que se ejecuta en el servidor de Convex
  handler: async (ctx, args) => {
    // 1. Buscar si ya existe un registro para este usuario (fid).
    // Usamos el índice "by_fid" que definimos en el schema para que la búsqueda sea ultra rápida.
    const existingToken = await ctx.db
      .query('notificationTokens')
      .withIndex('by_fid', (q) => q.eq('fid', args.fid))
      .unique();

    // 2. Decidir si actualizar uno existente o crear uno nuevo.
    if (existingToken) {
      // Si ya existe, actualizamos el registro con el nuevo token y URL.
      // Esto es importante por si el token del usuario es renovado.
      await ctx.db.patch(existingToken._id, {
        notificationUrl: args.notificationUrl,
        token: args.token,
      });
      console.log(`Token de notificación actualizado para el FID: ${args.fid}`);
      return existingToken._id;
    } else {
      // Si no existe, creamos un nuevo registro en la base de datos.
      const newId = await ctx.db.insert('notificationTokens', {
        fid: args.fid,
        notificationUrl: args.notificationUrl,
        token: args.token,
      });
      console.log(`Nuevo token de notificación almacenado para el FID: ${args.fid}`);
      return newId;
    }
  },
});

export const get = internalQuery({
  args: { fid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('notificationTokens')
      .withIndex('by_fid', (q) => q.eq('fid', args.fid))
      .unique();
  },
});
