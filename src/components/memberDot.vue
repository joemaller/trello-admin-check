<template>

  <div @click="clickHandler" class="member js-member-on-card-menu" v-bind:class="{guest:guest}" data-idmem="5512f73e5fcd0d90c6910167">
    <img v-if="avatarHash"
      class="member-avatar"
      height="30"
      width="30"
      v-bind:src="src"
      v-bind:srcset="srcset"
      v-bind:alt="`${fullName} (${username})`"
      v-bind:title="`${fullName} (${username})`"
    >
    <span v-else class="member-initials"  v-bind:title="`${fullName} (${username})`">{{initials}}</span>
  </div>
</template>

<script>
// console.log('click', this.click)
const avatarUrl = "https://trello-avatars.s3.amazonaws.com";
export default {
  props: ["id", "avatarHash", "initials", "fullName", "username", "guest"],
  methods: {
    clickHandler: function() {
      this.$emit("click", this.id);
    }
  },
  computed: {
    src: function() {
      return `${avatarUrl}/${this.avatarHash}/30.png`;
    },
    srcset: function() {
      return `${avatarUrl}/${this.avatarHash}/30.png 1x,
              ${avatarUrl}/${this.avatarHash}/50.png 2x,
              ${avatarUrl}/${this.avatarHash}/170.png 3x`;
    }
  }
};
</script>

<style lang="scss" scoped>
.member-avatar {
  height: 30px;
  width: 30px;
  border-radius: 25em;
}

.member {
  background-color: #d6dadc;
  border-radius: 25em;
  color: #4d4d4d;
  cursor: pointer;
  display: block;
  float: left;
  height: 30px;
  margin: 0 4px 4px 0;
  overflow: visible;
  position: relative;
  width: 30px;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 0;
  &.guest {
    background-color: #fcc;
  }
}
.member:hover {
  background-color: #cdd2d4;
}
.member:hover .member-avatar {
  opacity: 0.75;
}
.member.inline {
  float: none;
  display: inline-block;
}
.member-initials {
  display: block;
  font-size: 12px;
  font-weight: 700;
  height: 30px;
  left: 0;
  line-height: 30px;
  overflow: hidden;
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;
}
</style>
