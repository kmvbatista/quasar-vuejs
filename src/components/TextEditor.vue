<template>
  <div class="container">
    <v-row>
      <v-col cols="12">
        <tiptap-vuetify
          v-model="content"
          :extensions="extensions"
          @change="formatText"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from "tiptap-vuetify";

export default {
  components: { TiptapVuetify },
  props: ["text", "rule", "value"],
  data: () => ({
    extensions: [
      History,
      Blockquote,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3]
          }
        }
      ],
      Bold,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak
    ],
    content: ""
  }),
  computed: {
    formatText() {
      return this.$emit("update:text", this.content);
    }
  },
  methods: {
    cleanContent() {
      this.content = "";
    },
    updateContent(newItem) {
      this.content = newItem;
    }
  }
};
</script>
