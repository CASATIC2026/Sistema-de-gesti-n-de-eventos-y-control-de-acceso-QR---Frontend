<script setup>
import { Html5Qrcode } from "html5-qrcode"
import { ref, onBeforeUnmount } from "vue"
import api from "@/services/api"

let scanner = null
let isProcessing = false
let isScannerRunning = false

const qrText = ref("")
const status = ref("Esperando escaneo...")

const startScanner = async () => {

  try {

    // evitar múltiples starts
    if (isScannerRunning) return

    // crear scanner una sola vez
    if (!scanner) {
      scanner = new Html5Qrcode("reader")
    }

    status.value = "Iniciando cámara..."

    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },

      // cuando detecta QR
      async (decodedText) => {

        // evitar múltiples lecturas
        if (isProcessing) return

        isProcessing = true

        qrText.value = decodedText

        console.log("QR:", decodedText)

        status.value = "Validando ticket..."

        try {

          // detener scanner inmediatamente
          await scanner.stop()

          isScannerRunning = false

          // validar ticket
          const res = await api.post(
            "/ticket/validate-entry",
            {
              token: decodedText,
            }
          )

          console.log(res.data)

          status.value = "✔ Entrada válida"

        } catch (err) {

          console.error(err)

          status.value =
            "❌ " +
            (
              err.response?.data?.message ||
              err.message ||
              "Error desconocido"
            )

        }

        // esperar antes de siguiente scan
        setTimeout(async () => {

          try {

            // limpiar pantalla
            qrText.value = ""

            // desbloquear scanner
            isProcessing = false

            status.value = "Escaneando..."

            // reiniciar scanner
            await startScanner()

          } catch (err) {

            console.error(err)

          }

        }, 5000)
      },

      // error callback
      () => {}
    )

    isScannerRunning = true

    status.value = "Escaneando..."

  } catch (err) {

    console.error(err)

    status.value =
      "Error cámara: " +
      (err?.message || "No camera")

    isScannerRunning = false
  }
}

const stopScanner = async () => {

  try {

    if (scanner && isScannerRunning) {

      await scanner.stop()

      isScannerRunning = false

      status.value = "Scanner detenido"
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
  <div
    class="h-screen bg-black text-white flex flex-col items-center justify-center p-4"
  >

    <h1 class="text-2xl font-bold mb-2">
      QR Scanner
    </h1>

    <p class="mb-4 text-sm text-gray-300">
      {{ status }}
    </p>

    <div class="flex gap-2 mb-4">

      <button
        @click="startScanner"
        class="bg-green-500 px-4 py-2 rounded text-white"
      >
        Iniciar cámara
      </button>

      <button
        @click="stopScanner"
        class="bg-red-500 px-4 py-2 rounded text-white"
      >
        Detener
      </button>

    </div>

    <div
      id="reader"
      class="w-[300px] bg-white rounded overflow-hidden"
    ></div>

    <div
      class="mt-4 w-full max-w-md break-all text-green-400"
    >
      <p class="text-sm mb-1">
        QR leído:
      </p>

      <p>
        {{ qrText }}
      </p>
    </div>

  </div>
</template>