<script lang='ts'>
	import {goto} from '$app/navigation';

	let email: string = 'hhwang@student.42seoul.kr';
	let isInvalid: boolean = false;
	let block: boolean = false;

	async function emailCodeValidation(data: any) {
		try {
			const response = await fetch("http://localhost:3000/api/login/mailauth", {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			console.error("실패:", error);
		}
	}

	function emailCodeCheckEvent(e: any) {
		let code = e.target.value;
		if (code.length === 6 && !block) { 
			block = true;
			emailCodeValidation({emailCode : code})
			.then((res) => {
				setTimeout(() => {
					if (res) {
						const status = res.status;
						if (status === 201) {
							goto('/join');
						} else if (status === 500) {
							alert('server error');
							block = false;
						} else {
							isInvalid = true;
							block = false;
						}
					}
				}, 1000)
			});
		} else {
			isInvalid = false;
		}
	}
</script>

<div class="inform">
	<span class="simple_text">Check your EMAIL</span>
	<a href="https://profile.intra.42.fr/" class="mail_address">{email}</a>
</div>
<input type="text"
	maxlength="6"
	placeholder="put your verification code"
	class={isInvalid ? "invalid" : "valid"}
	disabled={block ? true : false}
	on:input={emailCodeCheckEvent}
	required>

<style>
	.inform {
		width: 400px;
		height: 200px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 30px;
	}

	.simple_text {
		margin-top: 130px;
		font-size: 30px;
		margin-bottom: 5px;
	}

	.mail_address {
		color: var(--text-color);
		font-size: 16px;
		text-decoration: underline;
	}

	.inform > a:hover {
		color: var(--intra-color);
		cursor: pointer;
	}
	
	.valid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
		border: 2px solid var(--text-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	.invalid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
		border: 2px solid rgb(200, 0, 0);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input[type=text]:disabled {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--border-color);
		caret-color: var(--border-color);
		border: 2px solid var(--border-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input:focus {
		outline: none;
		border: 2px solid var(--intra-color);
	}

	input:focus::placeholder {
		color: transparent;
	}
</style>
