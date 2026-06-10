<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const errors = ref({});

const validate = () => {
  errors.value = {};

  if (!email.value) {
    errors.value.email = "Correo requerido";
  }

  if (!password.value) {
    errors.value.password = "Contraseña requerida";
  }

  if (password.value !== confirmPassword.value) {
    errors.value.confirm = "Las contraseñas no coinciden";
  }

  return Object.keys(errors.value).length === 0;
};

const register = async () => {
  if (!validate()) return;

  try {
    await api.post("/auth/register", {
      email: email.value,
      password: password.value
    });

    alert("Cuenta creada 🎉");
    router.push("/login");

  } catch (error) {
    alert(error.response?.data?.message || "Error al registrarse");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-tertiary">

    <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">

      <h2 class="text-2xl font-bold text-center text-secondary mb-6">
        Crear Cuenta
      </h2>

      <!-- Email -->
      <div class="mb-4">
        <input
          v-model="email"
          type="email"
          placeholder="Correo"
          class="w-full border p-2 rounded"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full border p-2 rounded"
        />
        <p v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm -->
      <div class="mb-4">
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          class="w-full border p-2 rounded"
        />
        <p v-if="errors.confirm" class="text-red-500 text-sm">
          {{ errors.confirm }}
        </p>
      </div>

      <!-- Botón -->
      <button
        @click="register"
        class="w-full bg-primary text-white py-2 rounded hover:opacity-90"
      >
        Registrarse
      </button>

      <!-- Link -->
      <p class="text-sm text-center mt-4">
        ¿Ya tienes cuenta?
        <span
          @click="router.push('/login')"
          class="text-primary cursor-pointer"
        >
          Inicia sesión
        </span>
      </p>

    </div>

  </div>
</template>