<script lang="ts">
  import { apiUrl, modalStatesStore, myData } from "../../../store";
  import MatchStat from "./MatchStat.svelte";
  import type { Record } from "../../../interfaces";

  export let records: Record[] = [];
  let toggle: boolean = $myData.twoFactorAuth;

  const profileClickEvent = () => {
    (document.querySelector("#input-profile") as HTMLInputElement).click();
  };

  async function avatarSetAPI(data: any) {
    try {
      const response = await fetch(`${apiUrl}/api/user/set/avatar`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
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
  };

  const authToggleButton = () => {
    authSetAPI({ data: { twoFactorAuth: !toggle } }).then((res) => {
      if (res) {
        if (res.ok) {
          toggle = !toggle;
          $myData.twoFactorAuth = toggle;
        } else {
          alert("error! please retry");
        }
      }
    });
  };

  async function authSetAPI(data: any) {
    try {
      const response = await fetch(`${apiUrl}/api/user/set/two_factor_auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("프로필 사진 설정 실패:", error);
    }
  }
</script>

<div class="personal_box">
  {#if toggle}
    <button class="toggle" on:click={authToggleButton}>
      <i class="fa-solid fa-lock" />
    </button>
  {:else}
    <button class="toggle" on:click={authToggleButton}>
      <i class="fa-solid fa-lock-open" />
    </button>
  {/if}
  <button
    type="button"
    class="profile_image_circle"
    on:click={profileClickEvent}
  >
    <img class="image" src={$myData.avatar} alt="profile" />
  </button>
  <input
    id="input-profile"
    type="file"
    accept="image/*"
    on:change={fileUpload}
    style="display: none;"
  />
  <div class="personal_info">
    <button
      on:click={() => {
        $modalStatesStore.isNicknameModal = true;
      }}
    >
      {$myData.nickname}
    </button>
    <button
      on:click={() => {
        $modalStatesStore.isLogoutModal = true;
      }}
    >
      LOGOUT
    </button>
  </div>
</div>
<div class="stat_box">
  <MatchStat {records} />
</div>

<style>
  .toggle {
    position: absolute;
    top: 125px;
    left: 145px;
    border: none;
    background-color: var(--bg-color);
  }

  .fa-lock {
    font-size: 20px;
    color: var(--point-color);
  }

  .fa-lock-open {
    font-size: 20px;
    color: var(--border-color);
  }

  .personal_box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
  }

  .stat_box {
    display: flex;
    flex-direction: column;
    width: 60%;

    padding-left: 5.5%;
  }

  .profile_image_circle {
    width: 120px;
    height: 120px;
    border: 1px solid var(--border-color);
    border-radius: 70%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 20px;
  }

  .profile_image_circle:hover {
    border: 2px solid white;
    cursor: pointer;
    opacity: 0.5;
  }

  .profile_image_circle > .image {
    width: 115%;
    height: 115%;
    object-fit: cover;
  }

  .personal_info {
    width: 150px;
    height: 80px;
    display: flex;
    flex-direction: column;
  }

  .personal_info > button {
    width: 150px;
    margin-bottom: 10px;
  }
</style>
