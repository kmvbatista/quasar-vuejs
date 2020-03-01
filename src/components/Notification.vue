<template>
  <v-snackbar
    v-model="snackbar"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ text }}
    <v-btn dark text @click="closeSnackBar">Fechar</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: ["sucess", "errorMessage", "succesMessage"],
  data() {
    return {
      color: this.sucess ? "success" : "error",
      mode: "snackbar",
      snackbar: true,
      text: this.sucess ? this.succesMessage : this.errorMessage,
      timeout: 3000,
      x: null,
      y: "button"
    };
  },
  methods: {
    closeSnackBar() {
      this.snackbar = false;
      this.$emit("closeSnack");
    }
  }
};
</script>
