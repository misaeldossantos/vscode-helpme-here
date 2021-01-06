<script lang="ts">
     export let answer;
</script>

<style>
     .container {
          padding-bottom: 10px;
     }

     .header {
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow: auto;
          width: 100%;
     }

     .header * + * {
          margin-left: 10px;
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
     }
</style>

<div class="container">
     <div class="header">
          <img
               class="profile-image"
               alt={'Profile image'}
               src={answer.owner.profile_image} />
          <span> By {answer.owner.display_name} </span>
     </div>
     <hr />
     <p class="body">
          {@html answer['body']}
     </p>
</div>
