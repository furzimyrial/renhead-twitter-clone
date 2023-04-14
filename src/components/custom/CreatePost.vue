<template>
  <div class="px-5 py-2 flex gap-2">
    <Avatar :image="me.image" :name="me.fullName" />
    <div class="flex flex-col w-full">
      <textarea
        @input="handleInput"
        class="text-xl placeholder:font-thin outline-none w-full h-[50px] min-h-[50px] max-h-[200px] p-2 resize-none mb-3"
        placeholder="What's happening?"
        v-model="state.description"
      />
      <div
        class="mb-2 w-full rounded-xl overflow-hidden relative"
        v-if="state.image"
      >
        <img class="mb-2 w-full rounded-xl" :src="state.image" />
        <button
          class="bg-twitter-blue bg-opacity-20 text-twitter-blue absolute top-5 right-5 hover:bg-twitter-darkblue hover:bg-opacity-30 rounded-full w-[34px] h-[34px] p-2 hover:text-twitter-darkblue"
          @click="removeImage"
        >
          <CloseIcon class="w-[18px] h-[18px] min-w-[18px]" />
        </button>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-twitter-blue"
            v-for="item in items"
            @click="item.itemFunction"
          >
            <component :is="item.icon" class="w-full h-full" />
          </button>
        </div>
        <Button @click="handlePost" :disabled="isDisabled">{{
          isEditing ? "Save" : "Tweet"
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue";
import FileManager from "../../utils/file-manager";
import {
  CloseIcon,
  DotsIcon,
  EmojiIcon,
  GifIcon,
  LocationIcon,
  MediaIcon,
  PollIcon,
  ScheduleIcon,
} from "../icons";
import { Avatar, Button } from "../ui";
import { useStore } from "vuex";
import { TPost } from "../../types";

const state = reactive({
  image: "",
  description: "",
});

type TProps = {
  edit?: TPost | null;
};

const props = defineProps<TProps>();

const emit = defineEmits(["onNewPost", "onPostUpdate"]);

const removeImage = () => {
  state.image = "";
};

const store = useStore();

const me = computed(() => store.getters["getUser"]);

const isDisabled = computed(() => !state.image && !state.description.trim());
const isEditing = computed(() => !!props.edit);

const clearState = () => {
  state.description = "";
  state.image = "";
};

const trackEdit = () => {
  if (props.edit) {
    state.description = props.edit.description;
    state.image = props.edit.image;
  }
};

onMounted(trackEdit);

watch(() => props.edit, trackEdit);

const handlePost = async () => {
  if (isEditing.value) {
    emit("onPostUpdate", {
      ...state,
      id: props.edit?.id,
      user: me.value,
      comments: [],
      likes: [],
    });
  } else {
    emit("onNewPost", {
      ...state,
      user: me.value,
      comments: [],
      likes: [],
    });
  }

  clearState();
};

const items = [
  {
    name: "Media",
    icon: MediaIcon,
    itemFunction: async () => {
      const file = await FileManager.pick({ multiple: false });
      const dataUrl = await FileManager.read(file as File, "data-url");
      state.image = dataUrl as string;
    },
  },
  {
    name: "GIF",
    icon: GifIcon,
  },
  {
    name: "Poll",
    icon: PollIcon,
  },
  {
    name: "Emoji",
    icon: EmojiIcon,
  },
  {
    name: "Schedule",
    icon: ScheduleIcon,
  },
  {
    name: "Location",
    icon: LocationIcon,
  },
];

const handleInput = (e: Event) => {
  const el = e.target as HTMLInputElement;
  el.style.height = "5px";
  el.style.height = `${el.scrollHeight}px`;
};
</script>
