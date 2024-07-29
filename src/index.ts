import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';


joplin.plugins.register({

	onStart: async function() {
		console.log("onstart ...")
		
		// const kv = new Uint8Array(10)
		// const kx = new Uint8Array(10)
		// for (let i =0; i < 10; i++) {
		// 	kv[i] = 255-i
		// 	kx[i] = 255 ^ i
		// }
		// console.log("kv : "+kv)
		// console.log("kx : "+kx)

		await joplin.commands.register({
			name: 'enc_dec',
			label: 'encrypt or decrypt',
			iconName: 'fas fa-user-secret',
			execute: async () => {
				letsEncryptN();
			},
		});

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

					// user input password verifying is added
					if (apnew == 'NULL') {
						alert("password is not correct!");
					} else if ( id == 'Decrypt') {
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

		const XORCipher = {
			encode(key: string, plaintext: string) {
			  const bin = xor_encrypt(key, plaintext);
			  //console.log("bin : "+bin)
			  const hex = Array.from(bin, (b) => {
				//console.log("LOG: "+b +", "+b.toString(16) +", "+b.toString(16).padStart(4, '0'))
				return b.toString(16).padStart(4, '0')
			  }).join('');
			
			  // user input password verifying is added
			  return hex+verifyKey(key);
			  //return hex;
			},
		  
			decode(key: string, hexString: string) {
			  const hexes = hexString.match(/.{4}/g) as string[];

			  let keyHex = hexes.splice(-1,1)
			  //console.log("decode keyHex:"+keyHex)
				if (verifyKey(key)!= keyHex) {
					return "NULL"
				}
			  const bin = Uint16Array.from(hexes, (byte) => parseInt(byte, 16));
			  //console.log("bin2 : "+bin)
			  return xor_decrypt(key, bin);
			},
		  };
		  
		  function keyCharAt(key: string, i: number) {
			return key.charCodeAt(Math.floor(i % key.length));
		  }
		  
		  function xor_encrypt(key: string, plaintext: string) {
			const bin = new Uint16Array(plaintext.length);
			for (let i = 0; i < plaintext.length; i++) {
				//console.log(plaintext.charCodeAt(i) , keyCharAt(key, i) , plaintext.charCodeAt(i) ^ keyCharAt(key, i))
			  	bin[i] = plaintext.charCodeAt(i) ^ keyCharAt(key, i);
			}
			return bin;
		  }
		  
		  function xor_decrypt(key: string, bin: Uint16Array) {
			return Array.from(bin, (c, i) => String.fromCharCode(c ^ keyCharAt(key, i))).join('');
		  }

		  function verifyKey(key: string) {
			let keyNum = 0
			const bink = new Uint16Array(key.length);
			for (let i = 0; i < key.length; i++) {
				bink[i] = key.charCodeAt(i)
				keyNum += key.charCodeAt(i)
			}
			
			if (keyNum > 65535) {
				keyNum = keyNum % 65535
			} else if (keyNum < 5000) {
				keyNum = keyNum * 12
			}
			const decimalToHex = dec => dec.toString(16).padStart(4, '0');
			return decimalToHex(keyNum);
		  }
	},

});