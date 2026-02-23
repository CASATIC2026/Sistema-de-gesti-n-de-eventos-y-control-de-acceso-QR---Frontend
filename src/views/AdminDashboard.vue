<template>


  <div class="space-y-10">

    <!-- Header fuerte -->
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        Centro de Control
      </h1>
      <p class="text-gray-500 mt-2">
        Monitoreo en tiempo real del sistema de acceso QR
      </p>
    </div>

    <!-- Métricas principales -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-6">
        Indicadores Clave
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

        <StatCard
          title="Eventos Activos"
          value="3"
          subtitle="Actualmente en curso"
          borderColor="border-blue-500"
        />

        <StatCard
          title="Entradas Emitidas"
          value="1,240"
          subtitle="Total acumulado"
          borderColor="border-yellow-500"
        />

        <StatCard
          title="Accesos Validados"
          value="860"
          subtitle="Hoy"
          borderColor="border-green-600"
          valueColor="text-green-600"
        />

        <StatCard
          title="Intentos Duplicados"
          value="12"
          subtitle="Posibles fraudes"
          borderColor="border-red-600"
          valueColor="text-red-600"
        />

      </div>
    </section>

  </div>
</template>

<script setup>
import StatCard from '../components/admin/StatCard.vue'
</script>