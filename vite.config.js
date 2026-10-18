import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig( {
	plugins: [ react() ],
	resolve: {
		// shadcn-style imports: '@/components/ui/…', '@/lib/utils'
		alias: { '@': fileURLToPath( new URL( './src', import.meta.url ) ) }
	},
	server: { port: 5173, host: '127.0.0.1' },
	preview: { port: 4173, host: '127.0.0.1' }
} );
