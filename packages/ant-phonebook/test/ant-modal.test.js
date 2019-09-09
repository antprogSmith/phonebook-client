import { html, fixture, expect } from '@open-wc/testing';

import '../ant-modal.js';

describe('<ant-modal>', () => {
	it('has a default confirm text', async () => {
		const el = await fixture('<ant-modal></ant-modal>');
		expect(el.confirmText).to.equal('Confirm');
	});

	it('has a default cancel text', async () => {
		const el = await fixture('<ant-modal></ant-modal>');
		expect(el.cancelText).to.equal('Cancel');
	});

	it('has a default header text', async () => {
		const el = await fixture('<ant-modal></ant-modal>');
		expect(el.headerText).to.equal('Confirm');
	});



	it('allows property confirmText to be overwritten', async () => {
		const el = await fixture(html`<ant-modal confirmText="different confirmText"></ant-modal>`);
		expect(el.confirmText).to.equal('different confirmText');
	});

	it('allows property cancelText to be overwritten', async () => {
		const el = await fixture(html`<ant-modal cancelText="cancelText heading"></ant-modal>`);
		expect(el.cancelText).to.equal('cancelText heading');
	});

	it('allows property headerText to be overwritten', async () => {
		const el = await fixture(html`<ant-modal headerText="different heading"></ant-modal>`);
		expect(el.headerText).to.equal('different heading');
	});


	it('allows open() method to be called, and changes the opened attribute', async () => {
		const el = await fixture(html`<ant-modal></ant-modal>`);
		
		el.open();
		const exists = el.opened !== undefined;
		expect(exists).to.equal(true);
	});


	it('allows hide() method to be called, and changes the opened attribute', async () => {
		const el = await fixture(html`<ant-modal opened></ant-modal>`);
		const evt = new Event('cancel');

		el.hide(evt);
		const exists = el.opened === undefined;
		expect(exists).to.equal(false);
	});


	it('Call cancel event', async () => {
		const el = await fixture(html`<ant-modal opened></ant-modal>`);
		let eventFired = false;

		el.addEventListener('cancel', () => eventFired = true);
		const evt = new Event('cancel');
		el._cancel(evt);

		const exists = el.opened === undefined;
		expect(exists).to.equal(false);
		expect(eventFired).to.equal(true);
	});

	it('Call confirm event', async () => {
		const el = await fixture(html`<ant-modal opened></ant-modal>`);
		let eventFired = false;
		el.addEventListener('confirm', () => eventFired = true);

		const evt = new Event('confirm');
		el._confirm(evt);

		const exists = el.opened === undefined;
		expect(exists).to.equal(false);
		expect(eventFired).to.equal(true);
	});

});
