<script>
	const email = "hhwang@student.42seoul.kr"
</script>

<div class="inform">
	<span class="simple_text">Check your EMAIL</span>
	<a href="https://profile.intra.42.fr/" class="mail_address">{email}</a>
</div>
<input type="text" maxlength="6" placeholder="put your verification code" required>

<style>
	.inform {
		width: 400px;
		height: 200px;
		/* border: 1px solid var(--border-color); */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* align-items: center; */
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

	input[type=text] {
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

	input:focus {
		outline: none;
		border: 2px solid var(--intra-color);
	}

	input:focus::placeholder {
		color: transparent;
	}



</style>
