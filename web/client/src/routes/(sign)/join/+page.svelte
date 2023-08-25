<script lang="ts">
  import { onMount } from "svelte";
  import { apiUrl, myData } from "../../../store";
  import type { MyData } from "../../../interfaces";
  import { goto } from "$app/navigation";

  let isSigned: boolean = false;
  let isInvalidNickname: boolean = false;
  let block: boolean = false;
  let nickname: string = "";
  let profileSrc: string = "";

  const profileClickEvent = () => {
    (document.querySelector("#input-profile") as HTMLInputElement).click();
  };

  async function avatarSetAPI(data: any) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/set/avatar",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error) {
      console.error("프로필 사진 설정 실패:", error);
    }
  }

  const fileUpload = async (e: any) => {
    const selectedfile: FileList = e.target.files;
    let newAvatar: string | undefined = "";
    if (selectedfile.length > 0) {
      const [imageFile] = selectedfile;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const srcData = fileReader.result;
        newAvatar = srcData?.toString();
        avatarSetAPI({ data: { avatar: newAvatar } }).then((res) => {
          if (res) {
            if (res.ok) {
              $myData.avatar = newAvatar;
            } else {
              alert("Profile Image Setting Failed!");
            }
          }
        });
      };
      fileReader.readAsDataURL(imageFile);
    }
    /**
     * @TODO
     * 업로드한 이미지가 적절한지 확인
     * 프로필 변경 API
     */
  };

  const nicknameClickEvent = () => {
    block = true;
    nicknameSetAPI({ data: { nickname } }).then((res) => {
      setTimeout(() => {
        if (res) {
          const status = res.status;
          if (status === 201) {
            goto("/");
          } else {
            isInvalidNickname = true;
            block = false;
          }
        }
      }, 1000);
    });
  };

  async function nicknameSetAPI(data: any) {
    try {
      const response = await fetch(`${apiUrl}/api/user/set/nickname`, {
        method: "POST",
        credentials: "include",
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

  const focusEvent = () => {
    isInvalidNickname = false;
  };

  onMount(() => {
    getMyData();
  });

  const getMyData = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/user/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        goto("/signin");
        return;
      }
      const data: Promise<MyData> = response.json();
      $myData = await data;

      if ($myData.nickname) {
        goto("/");
      } else {
        isSigned = true;
      }
    } catch (error) {
      console.error("실패:", error);
    }
  };
</script>

{#if isSigned}
  <div class="box">
    <button type="button" id="change-button" on:click={profileClickEvent}>
      <img class="image" src={$myData.avatar} alt="profile" />
    </button>
    <input
      id="input-profile"
      type="file"
      accept="image/*"
      on:change={fileUpload}
      style="display: none;"
    />
    <form>
      <input
        type="text"
        maxlength="10"
        placeholder="put your nickname"
        bind:value={nickname}
        on:focus={focusEvent}
        class={isInvalidNickname ? "invalid" : "valid"}
        disabled={block ? true : false}
        required
      />
      <button on:click={nicknameClickEvent} type="submit"
        ><i class="fa-solid fa-paper-plane" /></button
      >
    </form>
  </div>
{/if}

<style>
  .box {
    width: 800px;
    height: 650px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .box > button {
    width: 200px;
    height: 200px;
    border-radius: 70%;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    overflow: hidden;
  }

  .box > button:hover {
    border: 2px solid white;
    cursor: pointer;
    opacity: 0.5;
  }

  .box > button > .image {
    width: 110%;
    height: 110%;
    object-fit: cover;
  }

  form {
    position: relative;
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

  input:focus {
    outline: none;
    border: 2px solid var(--intra-color);
  }

  input:focus::placeholder {
    color: transparent;
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

  input[type="text"]:disabled {
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

  form > button {
    position: absolute;
    top: 7px;
    right: 10px;

    height: 30px;

    border: none;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  form > button:active {
    padding-top: 0.2rem;
  }
</style>
