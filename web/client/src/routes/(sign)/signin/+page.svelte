<script lang="ts">
  import { apiUrl } from "../../../store";

  const test: string = "";
</script>

<div class="title">
  <h1>트센 시작한지 어언 3개월,</h1>
  <h1>드디어 우리 팀을 꾸릴 수 있게 되었다.</h1>
</div>

<div class="logo">
  <img class="image" src="/asset/IMG_2837.jpg" alt="make dongchoi member" />
</div>
<a href={`${apiUrl}/api/login`}>
  <button>LOGIN WITH 42</button>
</a>

<style>
  .title {
    position: absolute;
    top: 50px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color: var(--point-color);
  }

  h1 {
    font-size: 30px;
    font-weight: 800;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .logo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: none;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    overflow: hidden;
  }

  .logo > img {
    width: 110%;
    height: 110%;
    object-fit: cover;
  }

  button {
    width: 300px;
    height: 45px;
    margin: 0;
    padding: 0;
    outline: none;
    color: var(--text-color);
    background-color: var(--bg-color);
    border: 2px solid var(--intra-color);
    font-weight: 400;
  }

  button:hover {
    background-color: var(--intra-color);
  }
</style>
