<script lang="ts">
     import dayjs from "dayjs";

     export let answer;

     $: formattedDate = dayjs(new Date(answer.creation_date * 1000)).format("MMM DD[']YY [at] HH:mm");
</script>

<style>

     .container {
          padding-bottom: 20px;
     }

     .header {
          background-color: var(--vscode-button-background);
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow: auto;
          width: 100%;
          padding: 10px;
     }

     .header img {
          margin-right: 10px;
     }

     .profile-image {
          height: 30px;
          width: 30px;
          border-radius: 50%;
     }

     .body {
          overflow: auto;
          display: flex;
          flex-wrap: wrap;
          padding: 20px;
     }

     h1 {
          font-size: 14pt !important;
     }

     h2 {
          font-size: 12pt !important;
     }

</style>

<div class="container">
     <div class="header">
          <img
               class="profile-image"
               alt={'Profile image'}
               src={answer.owner.profile_image} />
          <div class="flex flex-col">
               <span class="author">
                    By
                    {@html answer.owner.display_name}
               </span>
               <span>{formattedDate}</span>
          </div>
     </div>
     <div class="body s-pose">
          {@html answer['body']}
     </div>
</div>
