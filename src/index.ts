import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
import * as crypto from 'crypto';

joplin.plugins.register({

	onStart: async function() {

		await joplin.commands.register({
			name: 'enc-dec',
			label: 'encrypt or decrypt',
			iconName: 'fas fa-bug',
			execute: async () => {
				letsEncrypt();
			},
		});
		await joplin.views.toolbarButtons.create('EnC/DeC', 'enc-dec', ToolbarButtonLocation.EditorToolbar);

		// make dialogs for asking password
		const dialogs = joplin.views.dialogs;

		const handle = await dialogs.create('EncDialog1');
		await dialogs.setHtml(handle, `
		<p>Please Enter your password</p>
		<form name="user">
			<input type="text" name="pwd"/>
		</form>
		`);

		const handle2 = await dialogs.create('DecDialog');
		await dialogs.setButtons(handle2, [
			{
				id: 'ok',
			},
			{
				id: 'cancel',
			},
			{
				id: 'Decrypt',
				title: 'Permanent',
			},
		]);
		await dialogs.setHtml(handle2, `
		<p>Please Enter your password</p>
		<form name="user">
			<input type="text" name="pwd"/>
		</form>
		`);

		async function letsEncrypt() {
			const current = await joplin.commands.execute("selectedText");
			if(current.startsWith("`ENC:") || current.startsWith("ENC:")) {
 				//console.log("it's encrypted ...")
				const result = await dialogs.open(handle2);
				const id = result.id
				if (id == 'cancel') {
					//console.log("canceled")
					return
				} else {
					const pawd = result.formData.user.pwd
					let iv = crypto.scryptSync(pawd, 'GfG', 16);
					let newtext = current.split(":")[1].split("`")[0];
					const apnew = decrypt(newtext, iv)

					if ( id == 'Decrypt') {
						//console.log("decrypted")
						await joplin.commands.execute("replaceSelection", apnew);
					} else if ( id == 'ok') {
						//console.log("OK")
						alert('decrypted : ' + apnew);
					}
				} 			
			} else {
				const result = await dialogs.open(handle);
				if (result.id == 'cancel') {
					//console.log("canceled")
					return
				}
				const pawd = result.formData.user.pwd
				let iv = crypto.scryptSync(pawd, 'GfG', 16);
				await joplin.commands.execute("replaceSelection", "`ENC:"+encrypt(current, iv)+"`");
			}
		}

		const algorithm = 'aes-256-cbc';
		const secret = "Very very secret key"
		const key = crypto.scryptSync(secret, 'GfG', 32);

		function encrypt(text: string, iv: Buffer): string {
			const cipher = crypto.createCipheriv(algorithm, key, iv);
			let encrypted = cipher.update(text, 'utf-8', 'hex');
			encrypted += cipher.final('hex');
			return encrypted;
		}
		function decrypt(encryptedText: string, iv: Buffer): string {
			const decipher = crypto.createDecipheriv(algorithm, key, iv);
			let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
			decrypted += decipher.final('utf-8');
			return decrypted;
		}
	},

});