<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { apiUrl } from "../../../store";

  let resendLink: string = "send the code again";
  let isInvalid: boolean = false;
  let block: boolean = false;
  let isGotCookie: boolean = false;

  async function emailCodeValidation(data: any) {
    try {
      const response = await fetch(`${apiUrl}/api/login/mailauth`, {
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

  function deleteCookie(name: string) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;";
  }

  function emailCodeCheckEvent(e: any) {
    let code = e.target.value;
    if (code.length === 6 && !block) {
      block = true;
      emailCodeValidation({ emailCode: code }).then((res) => {
        setTimeout(() => {
          if (res) {
            const status = res.status;
            if (status === 201) {
              deleteCookie("user_id");
              goto("/join");
            } else if (status === 500) {
              alert("server error");
              block = false;
            } else {
              isInvalid = true;
              block = false;
            }
          }
        }, 1000);
      });
    } else {
      isInvalid = false;
    }
  }

  onMount(() => {
    checkUserIdCookie();
  });

  const checkUserIdCookie = async (): Promise<void> => {
    const value: any = document.cookie.match("user_id=");
    if (value) {
      isGotCookie = true;
      return;
    } else {
      deleteCookie("user_id");
      goto("/join");
      return;
    }
  };
</script>

{#if isGotCookie}
  <div class="simple_text">Check your 42intra EMAIL</div>
  <input
    type="text"
    maxlength="6"
    placeholder="put your verification code"
    class={isInvalid ? "invalid" : "valid"}
    disabled={block ? true : false}
    on:input={emailCodeCheckEvent}
    required
  />
  <div class="resend-link">
    <span>Do you have any problem?</span>
    <span>&#8594;</span>
    <a href={`${apiUrl}/api/login`} class="mail_address">{resendLink}</a>
  </div>
{/if}

<style>
  .simple_text {
    line-height: 350px;
    width: 400px;
    height: 260px;
    font-size: 30px;
  }

  .mail_address {
    color: var(--text-color);
    font-size: 16px;
    text-decoration: underline;
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

  input:focus {
    outline: none;
    border: 2px solid var(--intra-color);
  }

  input:focus::placeholder {
    color: transparent;
  }

  .resend-link {
    padding-top: 10px;
  }

  .resend-link > a:hover {
    color: var(--intra-color);
    cursor: pointer;
  }
</style>
