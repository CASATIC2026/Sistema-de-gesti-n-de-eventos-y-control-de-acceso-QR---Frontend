<script>
export default {
    propos: {},
    setup() {
        
    }
}
</script>


<template>
    <div class="sidebar">
  <aside class="w-64 bg-blue-800 text-blue p-6">
    <h2 class="text-xl font-bold mb-6">Admin Panel</h2>

    
    <ul class="space-y-3">
      <li class="hover:text-blue-300 cursor-pointer">Dashboard</li>
      <li class="hover:text-blue-300 cursor-pointer">Eventos</li>
      <li class="hover:text-blue-300 cursor-pointer">Usuarios</li>
    </ul>
  </aside>
  </div>
</template>

<style>
:root {
    --sidebar-bg-color: #fadd8b;
    --sidebar-item-hover: #FFC122;
    --sidebar-item-active: #FAE7B3;
}
</style>

<style scoped>
.sidebar {
    color: white;
    background-color: var(--sidebar-bg-color);

    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;

    display: flex;
    flex-direction: column;
}
</style>
