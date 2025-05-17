import { test, expect } from '@playwright/test';

// Antes de lanzar las pruebas asegúrate de tener en marcha:
//   npm run dev   (servidor + ambas apps)

test.describe('Comunicación bidireccional vía WebSocket', () => {
	test('Un mensaje enviado desde A aparece en B y viceversa', async ({
		browser,
	}) => {
		// Contexto / página para A
		const contextA = await browser.newContext();
		const pageA = await contextA.newPage();
		await pageA.goto('http://localhost:3000');

		// Contexto / página para B
		const contextB = await browser.newContext();
		const pageB = await contextB.newPage();
		await pageB.goto('http://localhost:3001');

		// --- A envía mensaje --->
		await pageA.getByRole('button', { name: 'Enviar PING' }).click();

		// Esperar a que B lo reciba (usa selector de texto con timeout implícito)
		await expect(pageB.locator('li', { hasText: 'app-a' })).toContainText(
			'PING desde A'
		);

		// --- B responde --->
		await pageB.getByRole('button', { name: 'Enviar PING' }).click();
		await expect(pageA.locator('li', { hasText: 'app-b' })).toContainText(
			'PING desde B'
		);

		await contextA.close();
		await contextB.close();
	});
});
