<script setup>
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value
    });

    console.log("RESPUESTA LOGIN:", res.data);

    const token = res.data.data.token;

    console.log("TOKEN EXTRAÍDO:", token);

    if (!token) {
      throw new Error("Token no recibido del backend");
    }

    localStorage.setItem("token", token);

    router.push("/admin/events");

  } catch (err) {
    console.error(err);
    error.value = "Credenciales incorrectas";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-tertiary">

    <div class="bg-white p-6 rounded-xl shadow w-full max-w-sm">

      <h1 class="text-xl font-bold mb-4 text-center">
        Iniciar Sesión
      </h1>

      <input v-model="email" placeholder="Correo"
        class="w-full border p-2 mb-2 rounded"/>

      <input v-model="password" type="password" placeholder="Contraseña"
        class="w-full border p-2 mb-2 rounded"/>

      <p v-if="error" class="text-red-500 text-sm mb-2">
        {{ error }}
      </p>

      <button
        @click="login"
        class="w-full bg-primary text-white p-2 rounded"
      >
        Entrar
      </button>

    </div>

  </div>
</template>