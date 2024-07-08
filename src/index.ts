import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';


joplin.plugins.register({

	onStart: async function() {
		console.log("onstart ...")
		await joplin.commands.register({
			name: 'enc_dec',
			label: 'encrypt or decrypt',
			iconName: 'fas fa-user-secret',
			execute: async () => {
				letsEncryptN();
			},
		});
		// await joplin.commands.register({
		// 	name: 'enc_dec',
		// 	label: 'encrypt or decrypt',
		// 	iconName: 'fa fa-user-secret',
		// 	execute: async () => {
		// 		const current = await joplin.commands.execute("selectedText");
		// 		const result = await dialogs.open(handle);
		// 		if (result.id == 'cancel') {
		// 			return
		// 		}
		// 		console.log(result)
		// 		await joplin.commands.execute("replaceSelection", "`"+ result.formData.user.pwd +"`");
		// 		encTest(result.formData.user.pwd, current)
		// 		//alert('enc_dec : ' + encTest(result.formData.pwd) + ' , pwd : ' + result.formData.pwd);
				
		// 	},
		// });
		await joplin.views.toolbarButtons.create('EnCDeC', 'enc_dec', ToolbarButtonLocation.EditorToolbar);

		async function letsEncryptN() {
			
			const current = await joplin.commands.execute("selectedText");
			if(current.startsWith("`ENC:") || current.startsWith("ENC:")) {
				const result = await dialogs.open(handle2);
				const id = result.id
				if (id == 'cancel') {
					return
				} else {
					const pawd = result.formData.user.pwd
					let newtext = current.split(":")[1].split("`")[0];
					const apnew = XORCipher.decode(pawd, newtext)

					if ( id == 'Decrypt') {
						await joplin.commands.execute("replaceSelection", apnew);
					} else if ( id == 'ok') {
						alert('decrypted : ' + apnew);
					}
				} 			
			} else {
				const result = await dialogs.open(handle);
				if (result.id == 'cancel') {
					return
				}
				const pawd = result.formData.user.pwd
				const encrypted = XORCipher.encode(pawd, current);
				await joplin.commands.execute("replaceSelection", "`ENC:"+encrypted+"`");
			}
		};
		

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

		// async function letsEncrypt() {
		// 	const current = await joplin.commands.execute("selectedText");
		// 	if(current.startsWith("`ENC:") || current.startsWith("ENC:")) {
 		// 		//console.log("it's encrypted ...")
		// 		const result = await dialogs.open(handle2);
		// 		const id = result.id
		// 		if (id == 'cancel') {
		// 			//console.log("canceled")
		// 			return
		// 		} else {
		// 			const pawd = result.formData.user.pwd
		// 			let iv = crypto.scryptSync(pawd, 'GfG', 16);
		// 			let newtext = current.split(":")[1].split("`")[0];
		// 			const apnew = decrypt(newtext, iv)

		// 			if ( id == 'Decrypt') {
		// 				//console.log("decrypted")
		// 				await joplin.commands.execute("replaceSelection", apnew);
		// 			} else if ( id == 'ok') {
		// 				//console.log("OK")
		// 				alert('decrypted : ' + apnew);
		// 			}
		// 		} 			
		// 	} else {
		// 		const result = await dialogs.open(handle);
		// 		if (result.id == 'cancel') {
		// 			//console.log("canceled")
		// 			return
		// 		}
		// 		const pawd = result.formData.user.pwd
		// 		let iv = crypto.scryptSync(pawd, 'GfG', 16);
		// 		await joplin.commands.execute("replaceSelection", "`ENC:"+encrypt(current, iv)+"`");
		// 	}
		// }

		// const algorithm = 'aes-256-cbc';
		// const secret = "Very very secret key"
		// const key = crypto.scryptSync(secret, 'GfG', 32);

		// function encrypt(text: string, iv: Buffer): string {
		// 	const cipher = crypto.createCipheriv(algorithm, key, iv);
		// 	let encrypted = cipher.update(text, 'utf-8', 'hex');
		// 	encrypted += cipher.final('hex');
		// 	return encrypted;
		// }
		// function decrypt(encryptedText: string, iv: Buffer): string {
		// 	const decipher = crypto.createDecipheriv(algorithm, key, iv);
		// 	let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
		// 	decrypted += decipher.final('utf-8');
		// 	return decrypted;
		// }
		// var XORCipher = {
		// 	encode: function(key, data) {
		// 	  data = xor_encrypt(key, data);
		// 	  return b64_encode(data);
		// 	},
		// 	decode: function(key, data) {
		// 	  data = b64_decode(data);
		// 	  return xor_decrypt(key, data);
		// 	}
		//   };
		
		//   var b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		
		//   function b64_encode(data) {
		// 	var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
		// 	if (!data) { return data; }
		// 	do {
		// 	  o1 = data[i++];
		// 	  o2 = data[i++];
		// 	  o3 = data[i++];
		// 	  bits = o1 << 16 | o2 << 8 | o3;
		// 	  h1 = bits >> 18 & 0x3f;
		// 	  h2 = bits >> 12 & 0x3f;
		// 	  h3 = bits >> 6 & 0x3f;
		// 	  h4 = bits & 0x3f;
		// 	  enc += b64_table.charAt(h1) + b64_table.charAt(h2) + b64_table.charAt(h3) + b64_table.charAt(h4);
		// 	} while (i < data.length);
		// 	r = data.length % 3;
		// 	return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
		//   }
		
		//   function b64_decode(data) {
		// 	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
		// 	if (!data) { return data; }
		// 	data += "";
		// 	do {
		// 	  h1 = b64_table.indexOf(data.charAt(i++));
		// 	  h2 = b64_table.indexOf(data.charAt(i++));
		// 	  h3 = b64_table.indexOf(data.charAt(i++));
		// 	  h4 = b64_table.indexOf(data.charAt(i++));
		// 	  bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
		// 	  o1 = bits >> 16 & 0xff;
		// 	  o2 = bits >> 8 & 0xff;
		// 	  o3 = bits & 0xff;
		// 	  result.push(o1);
		// 	  if (h3 !== 64) {
		// 		result.push(o2);
		// 		if (h4 !== 64) {
		// 		  result.push(o3);
		// 		}
		// 	  }
		// 	} while (i < data.length);
		// 	return result;
		//   }
		
		//   function keyCharAt(key, i) {
		// 	return key.charCodeAt( Math.floor(i % key.length) );
		//   }
		
		//   function xor_encrypt(key, data) {
		// 	return data.split('').map(function(c, i) {
		// 		return c.charCodeAt(0) ^ keyCharAt(key, i);
		// 	  });
		//   }
		
		//   function xor_decrypt(key, data) {
		// 	return data.map(function(c, i) {
		// 		return String.fromCharCode( c ^ keyCharAt(key, i) );
		// 	  }).join("");
		//   }
		const XORCipher = {
			encode(key: string, plaintext: string) {
			  const bin = xor_encrypt(key, plaintext);
			  const hex = Array.from(bin, (b) => b.toString(16).padStart(2, '0')).join('');
			  return hex;
			},
		  
			decode(key: string, hexString: string) {
			  const hexes = hexString.match(/.{2}/g) as string[];
			  const bin = Uint8Array.from(hexes, (byte) => parseInt(byte, 16));
			  return xor_decrypt(key, bin);
			},
		  };
		  
		  function keyCharAt(key: string, i: number) {
			return key.charCodeAt(Math.floor(i % key.length));
		  }
		  
		  function xor_encrypt(key: string, plaintext: string) {
			const bin = new Uint8Array(plaintext.length);
			for (let i = 0; i < plaintext.length; i++) {
			  bin[i] = plaintext.charCodeAt(i) ^ keyCharAt(key, i);
			}
			return bin;
		  }
		  
		  function xor_decrypt(key: string, bin: Uint8Array) {
			return Array.from(bin, (c, i) => String.fromCharCode(c ^ keyCharAt(key, i))).join('');
		  }
	},

});