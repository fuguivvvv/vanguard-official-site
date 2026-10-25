<template>
  <div>
    <section class="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Engineering Excellence for Commercial Products
        </h1>
        <p class="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-8">
          Providing world-class technical consulting in environmental testing, reliability physics, and structural validation for industrial and commercial systems.
        </p>
        <NuxtLink to="/contact" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 transition">
          Schedule a Consultation
        </NuxtLink>
      </div>
    </section>

    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-white mb-4">Core Competencies</h2>
        <p class="text-slate-400">Empowering high-performance hardware with rigorous verification frameworks</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
          <div class="h-48 mb-6 rounded-xl overflow-hidden bg-slate-900">
            <img src="/images/home-card-environmental.jpg" alt="Environmental Testing" class="w-full h-full object-cover" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Environmental Testing, Reliability Testing & Validation</h3>
          <p class="text-slate-400 text-sm mb-6">Comprehensive vibration, thermal, shock, and climate qualification strategies designed to survive demanding operational profiles and extended lifecycles.</p>
          <NuxtLink to="/testing" class="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center">
            Explore Detailed Testing Types & Standards →
          </NuxtLink>
        </div>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
          <div class="h-48 mb-6 rounded-xl overflow-hidden bg-slate-900">
            <img src="/images/home-hero-bg.jpg" alt="Structural Dynamics" class="w-full h-full object-cover" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Structural Dynamics & Fault Diagnosis</h3>
          <p class="text-slate-400 text-sm mb-6">Advanced modal testing, finite element simulation, field vibration data acquisition, and vibration-based fault diagnosis for commercial machinery and structures.</p>
          <NuxtLink to="/dynamics" class="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center">
            Explore In-Depth Technical Details →
          </NuxtLink>
        </div>

        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
          <div class="h-48 mb-6 rounded-xl overflow-hidden bg-slate-900">
            <img src="/images/home-card-compliance.jpg" alt="Lab Accreditation" class="w-full h-full object-cover" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Laboratory Accreditation & Compliance</h3>
          <p class="text-slate-400 text-sm mb-6">Tailoring international and industrial standards (such as ISO, IEC, and ASTM protocols) to guarantee compliance for electronic and mechanical assemblies.</p>
          <NuxtLink to="/labcompliance" class="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center">
            Explore Laboratory Setup & Accreditation Services →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>