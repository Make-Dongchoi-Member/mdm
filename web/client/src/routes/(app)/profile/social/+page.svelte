<script></script>

<div class="info_box">
		<div class="profile_image_circle">
		</div>
		<div class="personal_info">
			<button>
				nickname
			</button>
			<button>
				LOGOUT
			</button>
		</div>
	</div>
	<div class="data_box">
		<div class="button_area">
			<nav>
				<a href="/profile">HISTORY</a>
				<a href="/profile/social">SOCIAL</a>
			</nav>
		</div>
		<div class="data">
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
			<div>
				<div>
					test
				</div>
				<div>
					hehe
				</div>
			</div>
		</div>
	</div>

<style>
	/* scroll bar */

	.data {
        height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .data::-webkit-scrollbar {
        width: 6px;
        height: 30px;
    }

    .data::-webkit-scrollbar-track {
        background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
    }

    .data::-webkit-scrollbar-thumb {
        background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
        border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
    }

    .data::-webkit-scrollbar-thumb:hover {
        background-color: var(--text-color) /* 스크롤바 썸바 호버 배경색 설정 */
    }

	/* scroll bar */

	.data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		/* border: 1px solid white; */
		width: 775px;
		/* height: 300px; */
		margin: 10px 10px 10px 15px;
	}

	.data > div {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        height: 45px;
        width: 370px;
        margin-right: 10px;
        margin-bottom: 10px;
        outline: none;
        border: 1px solid var(--border-color);
        background-color: var(--bg-color);
        color: var(--text-color);
    }

	.data > div > :nth-child(2) {
        display: flex;
        padding-left: 5px;
    }

    .data > div > :nth-child(3) {
        flex-grow: 10;
        text-align: right;
        padding-right: 10px;
    }

	.info_box {
		border: 1px solid var(--border-color);
		height: 250px;
	}

	.profile_image_circle {
		border: 1px solid var(--border-color);
		border-radius: 50%;
		width: 100px;
		height: 100px;
		margin: 30px 20px 20px 40px;
	}

	.personal_info {
		width: 150px;
		height: 80px;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		margin-left: 15px;
	}

	.personal_info > button {
		width: 150px;
		/* height: 30px; */
		/* border: 1px solid var(--border-color); */
		/* background-color: var(--bg-color); */
		/* color: var(--text-color); */
		/* text-align: center; */
		margin-bottom: 10px;
	}

	.data_box {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
	}

	.button_area {
		display: flex;
		flex-direction: row;
		/*border: 1px solid black;*/
		width: 750px;
		height: 30px;
		margin: 20px 10px 10px 15px;
	}

	nav {
		display: flex;
		/* align-items: center; */
	}

	nav > a {
		width: 150px;
		/* height: 30px; */
		border: 1px solid var(--border-color);
		text-align: center;
		color: var(--text-color);
		background-color: var(--bg-color);
		padding-top: 5px;
		text-decoration: none;
		margin-right: 15px;
	}

	nav > a:hover {
		background-color: var(--hover-color);
	}
</style>
