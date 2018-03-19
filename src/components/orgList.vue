<template>
<div class="org">
    <div class="members">
      <h2>All Team Users:</h2>
    <member-dot v-for="member in members" v-bind="member" v-bind:key="member.id" />
    </div>

    <div class="members">
      <h2>Team Admins:</h2>
    <member-dot v-for="admin in admins" v-bind="admin" v-bind:key="admin.id" />
    </div>

    <h2>Boards:</h2>

    <div class="boards" v-for="(board, index) in boards" v-bind:key="board.id">
        <div class="name"><strong>{{ board.name }}</strong><br><small>{{ board.id }}</small></div>
        <div class="admins">
          <member-dot @click="((id) => demote(board.id, id, index))" v-for="admin in board.admins" v-bind="memberKey[admin]" v-bind:key="admin" />
        </div>
        <div class="nonadmins">
          <member-dot @click="((id) => promote(board.id, id, index))" v-for="admin in board.nonadmins" v-bind="memberKey[admin]" v-bind:key="admin" />
        </div>
    </div>

  <div class="dump">
<!-- <div><h2>Boards: {{ boardCount }}</h2></div>
<div><h2>Memberships: {{ membershipsCount }}</h2></div>
 -->    <pre>{{ orgs }}</pre></div>
    </div>
</template>

<script>
import memberDot from "./memberDot";

const memberPlaceholder = m => ({
  id: m.idMember,
  initials: "??",
  username: "",
  fullName: ""
});

const getBoardAdmins = function(board) {
  console.log(board, this);
  board.admins = board.memberships
    .filter(m => m.memberType === "admin")
    .map(m => {
      if (!this.memberKey.hasOwnProperty(m.idMember)) {
        this.$set(this.memberKey, m.idMember, memberPlaceholder(m));
        window.Trello.get(
          `/members/${
            m.idMember
          }?fields=avatarHash,fullName,id,username,initials`
        ).then(data => {
          const memberIds = this.members.map(m => m.id);
          if (!memberIds.includes(m.idMember)) {
            data.guest = true;
          }
          this.memberKey[m.idMember] = data;
        });
      }
      return m.idMember;
    });
  board.nonadmins = this.admins
    .map(a => a.id)
    .filter(a => !board.admins.includes(a));
  return board;
};

export default {
  props: ["org"],
  data() {
    return {
      orgs: [{ idBoards: [], memberships: [] }],
      members: [],
      memberKey: {},
      memberships: [],
      boards: []
    };
  },
  components: { memberDot },
  computed: {
    admins: function() {
      return this.members.filter(m => this.memberships.includes(m.id));
    }
  },
  methods: {
    promote: function(idBoard, idMember, index) {
      console.log("promote", idBoard, idMember, index);
      this.adminUpdate(idBoard, idMember, index, "admin");
    },
    demote: function(idBoard, idMember, index) {
      console.log("demote", idBoard, idMember, index);
      this.adminUpdate(idBoard, idMember, index, "normal");
    },
    /**
     * Handler for promote/demote
     * @param  {string} idBoard  board ID
     * @param  {string} idMember member ID
     * @param  {integer} index    Index of the board in data.boards
     * @param  {string} type     "admin" (promote) or "normal" (demote)
     */
    adminUpdate: function(idBoard, idMember, index, type) {
      const call = `/boards/${idBoard}/members/${idMember}?type=${type}`;
      window.Trello.put(call).then((board) => {
        console.log("adminUpdate", board);
        console.log('this', this)
        console.log(index, this.boards[index]);
        this.$set(this.boards, index, getBoardAdmins.bind(this, board)())

        // this.updateBoardMembers(index, data);
      })
      .catch(err => console.error(err))
    }
  },

  mounted: function() {
    // const memberPlaceholder =  m => ({
    //                   id: m.idMember,
    //                   initials: "??",
    //                   username: "",
    //                   fullName: ""
    //                 });
    // console.log("mounted!");
    // console.log(this.org);
    // console.log(this.org.id);
    // console.log("fetching orgs and boards");
    window.Trello.get(
      `/organizations/${
        this.org.id
      }/members?fields=avatarHash,fullName,id,username,initials`
    )
      .then(data => {
        const memberKey = data.reduce((acc, cur) => {
          // console.log(cur.id);
          acc[cur.id] = cur;
          return acc;
        }, {});
        this.members = data;
        this.memberKey = memberKey;
      })
      .catch(err => console.error(err))
      .then(() => window.Trello.get(`/organizations/${this.org.id}/boards`))
      .then(data => {
        this.boards = data.map(getBoardAdmins.bind(this));
        // this.boards = data.map(b => {
        //   b.admins = b.memberships
        //     .filter(m => m.memberType === "admin")
        //     .map(m => {
        //       if (!this.memberKey.hasOwnProperty(m.idMember)) {
        //         this.$set(this.memberKey, m.idMember, memberPlaceholder(m));
        //         window.Trello.get(
        //           `/members/${
        //             m.idMember
        //           }?fields=avatarHash,fullName,id,username,initials`
        //         ).then(data => {
        //           const memberIds = this.members.map(m => m.id);
        //           if (!memberIds.includes(m.idMember)) {
        //             data.guest = true;
        //           }
        //           this.memberKey[m.idMember] = data;
        //         });
        //       }
        //       return m.idMember;
        //     });
        //   b.nonadmins = this.admins
        //     .map(a => a.id)
        //     .filter(a => !b.admins.includes(a));
        //   return b;
        // });
      });

    window.Trello.get(
      `/organizations/${this.org.id}/memberships?filter=admin&member=false`
    )
      .then(data => {
        this.memberships = data.map(m => m.idMember);
      })
      .catch(err => console.error(err));
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~@/sass/vars";

.members {
  max-width: 650px;
  margin: auto;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.dump {
  clear: both;

  background: #cef;
  margin: auto;
  max-width: 650px;
  text-align: left;
}

.boards {
  display: grid;
  max-width: 650px;
  margin: auto;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: minmax(2.5rem, auto);
  grid-template-areas: "name admins non-admins";

  .name {
    grid-area: "name";
    text-align: left;
  }

  .admins {
    grid-area: "admins";
  }
  .nonadmins {
    grid-area: "non-admins";
  }
}
</style>
