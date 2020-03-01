<template>
  <v-menu
    v-model="menu2"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        persistent-hint
        prepend-icon="event"
        readonly
        v-on="on"
        :rules="[rule]"
        :value="computedDateFormatted"
      ></v-text-field>
    </template>
    <v-date-picker
      no-title
      @input="menu2 = false"
      @change="emitDate"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: ['rule', 'label', 'value'],
  data: () => ({
    menu1: false,
    menu2: false
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.value);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      if (date.includes('/')) return date;
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    emitDate(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style></style>
