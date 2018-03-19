<template>
  <div id="app">
    <div class="auth" v-if="!auth">
      <button v-on:click="TrelloAuth">Authorize</button>
    </div>
    <div v-else-if="me.fullName">
      Hi {{ me.fullName }}
    </div>
    <div class="organizations">

    <org-list v-if="auth" v-for="org in orgs" v-bind:org="org" v-bind:key="org.id" v-bind:me="me.id" />
    </div>
    <div class="al"><pre>stuff: {{ stuff }}<br>Auth?: {{ auth }}<br>me: {{ me }}</pre></div>
</div>

</template>

<script>
import orgList from "./components/orgList";
const methods = {};

methods.TrelloAuth = function() {
  // console.log("trelloAuth", this);
  // console.log(a,b)
  // console.log("clicked", this.isActive);
  // this.isActive = !this.isActive;
  // this.stuff = { foo: 12, bar: 24 };
  // this.stuff = Object.assign(this.stuff, { foo: "bar" });
  // this.stuff.baroom = Math.random();
  // this.stuff.hoo = 1234567890;
  // this.me = { frog: 33 };

  // const vm = this;
  // console.log(this);
  // const success = authenticationSuccess.bind(null, this)
  const success = () => {
    // console.log("in success", this);
    this.auth = true;
    window.Trello.get("members/me")
      .then(data => (this.me = data))
      .catch(err => console.error(err))
      .then(() => window.Trello.get("members/me/organizations"))
      .then(data => {
        this.orgs = data;
      })
      .catch(err => console.error(err));
  };

  window.Trello.authorize({
    type: "popup",
    name: "Getting Started Application",
    scope: {
      read: "true",
      write: "true"
    },
    expiration: "1hour",
    // success: () => console.log(this),
    success: success,
    error: () => console.log("Failed authentication")
  });
  // .then(data => console.log('AUTH', data))

  // console.log(this);
};

export default {
  // const App = {
  name: "App",
  data() {
    return {
      msg: "Trello Admin",
      isActive: false,
      stuff: { no: 0 },
      me: { id: null },
      orgs: [],
      auth: false
    };
  },
  components: { orgList },  // note: the component is automatically camel-cased, so orgList becomes <org-list>
  // components: { "org-list": orgList },
  methods,
  computed: {
    isAuthenticated: function() {
      return window.foo;
      // return window.Trello.authorized();
    }
  }
};

// export default App;
</script>

<style lang="scss" scoped>
@import "~@/sass/vars";
button {
  font-size: $font-size;
  padding: 0.5rem 2rem;
  background: white;
  border-color: $iop-orange;
  color: $iop-orange;
}

// button.active {
//   border: 3px solid red;
// }
.al {
  margin: auto;
  background: #fed;
  max-width: 650px;
  text-align: left;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
