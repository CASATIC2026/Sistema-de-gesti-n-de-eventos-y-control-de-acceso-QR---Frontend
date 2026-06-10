<script setup>
import { Html5Qrcode } from "html5-qrcode"
import { ref, onBeforeUnmount } from "vue"
import api from "@/services/api"

let scanner = null
let isProcessing = false
let isScannerRunning = false

const qrText = ref("")
const status = ref("Esperando escaneo...")
const statusType = ref("info") // info, success, error

const startScanner = async () => {
  try {
    if (isScannerRunning) return

    if (!scanner) {
      scanner = new Html5Qrcode("reader")
    }

    status.value = "Iniciando cámara..."
    statusType.value = "info"

    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      async (decodedText) => {
        if (isProcessing) return
        isProcessing = true
        qrText.value = decodedText
        console.log("QR:", decodedText)
        status.value = "Validando ticket..."
        statusType.value = "info"

        try {
          await scanner.stop()
          isScannerRunning = false

          const res = await api.post("/ticket/validate-entry", {
            token: decodedText,
          })

          console.log(res.data)
          status.value = "✓ Entrada válida"
          statusType.value = "success"

        } catch (err) {
          console.error(err)
          status.value = "✗ " + (err.response?.data?.message || err.message || "Error desconocido")
          statusType.value = "error"
        }

        setTimeout(async () => {
          try {
            qrText.value = ""
            isProcessing = false
            status.value = "Escaneando..."
            statusType.value = "info"
            await startScanner()
          } catch (err) {
            console.error(err)
          }
        }, 3000)
      },
      () => {}
    )

    isScannerRunning = true
    status.value = "Escaneando..."
    statusType.value = "info"

  } catch (err) {
    console.error(err)
    status.value = "Error: " + (err?.message || "No se pudo acceder a la cámara")
    statusType.value = "error"
    isScannerRunning = false
  }
}

const stopScanner = async () => {
  try {
    if (scanner && isScannerRunning) {
      await scanner.stop()
      isScannerRunning = false
      status.value = "Scanner detenido"
      statusType.value = "info"
    }
  } catch (err) {
    console.error(err)
  }
}

onBeforeUnmount(async () => {
  await stopScanner()
})
</script>

<template>

   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
    
    <!-- Card principal -->
    <div class="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8">
      
      <!-- Header con logo -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <span class="material-symbols-outlined text-primary text-3xl">qr_code_scanner</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Escáner QR
        </h1>
        <p class="text-white/50 text-sm mt-1">Valida entradas en segundos</p>
      </div>

      <!-- Status con diseño elegante -->
      <div 
        class="mb-6 p-4 rounded-xl text-center transition-all duration-300"
        :class="{
          'bg-blue-500/20 border border-blue-500/30 text-blue-300': statusType === 'info',
          'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300': statusType === 'success',
          'bg-red-500/20 border border-red-500/30 text-red-300': statusType === 'error'
        }"
      >
        <div class="flex items-center justify-center gap-2">
          <span 
            class="material-symbols-outlined text-sm"
            :class="{
              'animate-pulse': statusType === 'info',
              '': statusType === 'success',
              '': statusType === 'error'
            }"
          >
            {{ statusType === 'info' ? 'scan' : statusType === 'success' ? 'check_circle' : 'error' }}
          </span>
          <p class="font-medium text-sm">{{ status }}</p>
        </div>
      </div>

      <!-- Botones de control -->
      <div class="flex gap-3 mb-6">
        <button
          @click="startScanner"
          class="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-base">videocam</span>
          Iniciar cámara
        </button>
        <button
          @click="stopScanner"
          class="flex-1 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-base">stop</span>
          Detener
        </button>
      </div>

      <!-- Contenedor del scanner -->
      <div class="relative">
        <div 
          id="reader" 
          class="w-full rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20"
        ></div>
        
        <!-- Overlay decorativo-->
         <div class="absolute inset-0 pointer-events-none rounded-xl border-2 border-primary/30"></div>
        
         <!-- Esquinas decorativas  -->
        <div class="absolute top-0 left-0 w-8 h-8  border-t-2 border-l-2 border-primary rounded-tl-xl"></div>
        <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl"></div>
        <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl"></div>
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl"></div>
      </div> 

      <!-- Instrucción -->
      <p class="text-white/40 text-xs text-center mt-4">
        Coloca el código QR dentro del área de escaneo
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el scanner */
#reader {
  background: #000;
}

#reader video {
  border-radius: 0.75rem;
}

#reader__scan_region {
  background: transparent;
}
</style>