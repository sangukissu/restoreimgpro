export type SupportedLang = "es" | "pt-br" | "id" | "de" | "ru" 

export interface LocalizedPageData {
  lang: SupportedLang
  locale: string
  slug: string
  country: string
  meta: {
    title: string
    description: string
    keywords: string[]
  }
  hero: {
    h1: string
    subheadline: string
    ctaText: string
    trustBadge: string
  }
  sectionTitles: {
    showcase: string
    benefits: string
    howItWorks: string
    testimonials: string
    faqs: string
    stepLabel: string
  }
  showcaseCaptions: {
    beforeLabel: string
    afterLabel: string
    caption: string
    beforeImage: string
    afterImage: string
  }[]
  howItWorks: {
    step: number
    title: string
    description: string
  }[]
  trustAndPrivacy: {
    title: string
    description: string
    policy: string
  }
  benefitsSection: {
    title: string
    subtitle: string
    cards: {
      title: string
      description: string
      icon: "Sun" | "CloudRain" | "Droplets" | "Heart" | "Users" | "Landmark" | "Clock" | "Shield" | "Sparkles" | "Zap" | "History" | "Archive"
      variant: "dark" | "light" | "orange"
      colSpan: 1 | 2 | 3
    }[]
  }
  pricing: {
    title: string
    subtitle: string
    plans: {
      name: string
      price: string
      description: string
      badge: string
      details: string[]
      featured?: boolean
    }[]
  }
  localCostComparison: {
    title: string
    studioCost: string
    bringBackCost: string
    turnaround: string
    summary: string
  }
  testimonials: {
    name: string
    location: string
    quote: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
  bottomCta: {
    title: string
    subtitle: string
    buttonText: string
  }
}

export const countryPages: Record<SupportedLang, LocalizedPageData> = {
  es: {
    lang: "es",
    locale: "es-ES",
    slug: "/es/recrear-fotos-con-ai",
    country: "España y Latinoamérica",
    meta: {
      title: "Recrear Fotos con IA | Restaurar Fotos Antiguas en Minutos",
      description: "Arregla fotos antiguas borrosas, rasgadas o dañadas por la humedad. Descubre cómo recrear fotos con IA al instante y sin pagar costosos estudios fotográficos.",
      keywords:[
        "recrear fotos", 
        "restaurar fotos antiguas", 
        "arreglar fotos dañadas", 
        "foto antigua borrosa", 
        "restauración de fotos con IA",
        "recrear fotos con IA"
      ],
    },
    hero: {
      h1: "Vuelve a recrear fotos antiguas y rescata la historia de tu familia",
      subheadline: "Arregla fotos antiguas borrosas, con rasgaduras o dañadas por la humedad al instante. Calidad de estudio profesional sin salir de casa.",
      ctaText: "Restaurar mi foto ahora",
      trustBadge: "Más de 2.900 familias en España y LatAm ya confían en BringBack",
    },
    sectionTitles: {
      showcase: "Resultados reales de restauración",
      benefits: "Por qué digitalizar y restaurar hoy mismo",
      howItWorks: "Cómo funciona",
      testimonials: "Historias de familias reales",
      faqs: "Preguntas frecuentes",
      stepLabel: "Paso",
    },
    showcaseCaptions:[
      {
        beforeLabel: "Antes",
        afterLabel: "Después",
        caption: "Foto de boda de los abuelos con rotura central y pérdida de color, completamente restaurada.",
        beforeImage: "/torn.webp",
        afterImage: "/torn-restored.webp",
      },
      {
        beforeLabel: "Antes",
        afterLabel: "Después",
        caption: "Retrato de infancia afectado por la humedad y el paso del tiempo, recuperado con nitidez.",
        beforeImage: "/faded.webp",
        afterImage: "/fade-restored.webp",
      },
    ],
    howItWorks:[
      {
        step: 1,
        title: "Sube tu foto de forma segura",
        description: "Hazle una foto a tu imagen impresa con el móvil o escanéala. Súbela a nuestra plataforma web sin instalar ninguna aplicación.",
      },
      {
        step: 2,
        title: "La Inteligencia Artificial trabaja",
        description: "En segundos, nuestro sistema detecta y arregla fotos dañadas, elimina rayones, manchas de agua y devuelve la nitidez a rostros borrosos.",
      },
      {
        step: 3,
        title: "Descarga y emociona a tu familia",
        description: "Guarda tu foto restaurada en alta resolución (1080p), lista para imprimir, enmarcar o enviar por el grupo familiar de WhatsApp.",
      },
    ],
    trustAndPrivacy: {
      title: "Privacidad absoluta para los recuerdos de tu familia",
      description: "Sabemos que estas fotos son tu tesoro más preciado. Nuestro sistema está diseñado para proteger tu privacidad desde el primer clic.",
      policy: "Tus fotos siguen siendo exclusivamente tuyas. Los archivos que subes se eliminan de forma automática y permanente de nuestros servidores en un plazo de 30 minutos.",
    },
    benefitsSection: {
      title: "El tiempo no perdona a tus fotos de papel. Nosotros sí.",
      subtitle: "Cada año que pasa, el papel se degrada más. Detén el deterioro y protege tu historia hoy mismo.",
      cards:[
        {
          title: "El enemigo silencioso: La humedad y el sol",
          description: "En España y Latinoamérica, el calor y la humedad tropical hacen que las fotos se peguen al cristal o se llenen de manchas amarillas. El sol desvanece los colores originales. Restaurarlas digitalmente es la única forma de detener este deterioro.",
          icon: "Droplets",
          variant: "dark",
          colSpan: 2,
        },
        {
          title: "Respaldo Digital Eterno",
          description: "El papel se rompe y se pierde en las mudanzas. Tu copia digital en alta resolución dura para siempre.",
          icon: "Archive",
          variant: "light",
          colSpan: 1,
        },
        {
          title: "Un Regalo Inolvidable",
          description: "Ideal para aniversarios, Bodas de Oro, o para colocar un retrato perfecto en el altar del Día de Muertos.",
          icon: "Heart",
          variant: "orange",
          colSpan: 1,
        },
        {
          title: "Resultados de Estudio en Casa",
          description: "Olvídate de entregar tus originales únicos a un desconocido en una tienda y esperar semanas por un presupuesto.",
          icon: "Zap",
          variant: "light",
          colSpan: 2,
        },
      ],
    },
    pricing: {
      title: "Planes claros y accesibles",
      subtitle: "Sin suscripciones ocultas. Paga una vez, usa tus créditos cuando quieras.",
      plans:[
        {
          name: "Starter",
          price: "$4.99",
          description: "Perfecto para probar la restauración de fotos en alta calidad.",
          badge: "Pago único",
          details:[
            "5 créditos de restauración",
            "Resultados en alta resolución",
            "Mejora y escalado de foto gratis",
            "Los créditos nunca caducan",
            "Garantía de devolución de 30 días"
          ],
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "El mejor valor para arreglar fotos y darles vida con movimiento.",
          badge: "Mejor Valor",
          details:[
            "20 créditos flexibles",
            "Úsalos para restaurar fotos",
            "O para crear animaciones de video",
            "Salida en alta resolución 1080p",
            "Los créditos nunca caducan",
            "Garantía de devolución de 30 días"
          ],
          featured: true,
        },
        {
          name: "Family",
          price: "$21.99",
          description: "Diseñado para digitalizar álbumes enteros y compartir.",
          badge: "Pago único",
          details:[
            "60 créditos flexibles",
            "Úsalos para restaurar fotos",
            "O para crear animaciones de video",
            "Salida en alta resolución 1080p",
            "Los créditos nunca caducan",
            "Garantía de devolución de 30 días"
          ],
        },
      ],
    },
    localCostComparison: {
      title: "Por qué BringBack AI es la decisión inteligente",
      studioCost: "Estudio Tradicional (España/México): Desde 25€ a 80€ (o hasta $1,800 MXN) por arreglar una sola foto.",
      bringBackCost: "BringBack AI: Desde menos de $1 USD por foto restaurada.",
      turnaround: "Tiempo de entrega: Segundos en nuestra plataforma vs. Semanas de espera en tiendas.",
      summary: "Los estudios tradicionales cobran por horas de trabajo manual. Al usar nuestra tecnología para arreglar fotos dañadas, obtienes la misma calidad profesional por una fracción del precio, sin salir de casa y al instante.",
    },
    testimonials:[
      {
        name: "Carmen L.",
        location: "Valencia, España",
        quote: "Quería recrear unas fotos de la boda de mis padres que estaban pegadas al vidrio y llenas de humedad. BringBack quitó todas las manchas en un par de clics. Mi madre lloró de emoción al verla.",
      },
      {
        name: "Alejandro V.",
        location: "Monterrey, México",
        quote: "Tenía una foto antigua borrosa de mi abuelo que falleció hace años. La subí para arreglarla y ahora parece tomada ayer. ¡Incluso usé la opción de animarla y fue increíble verle sonreír!",
      },
      {
        name: "Sofía M.",
        location: "Buenos Aires, Argentina",
        quote: "Llevé una foto rasgada a un estudio físico y me cobraban una fortuna. Aquí pude restaurar fotos antiguas de toda mi familia por el precio de un café. Excelente calidad en los rostros.",
      },
    ],
    faq:[
      {
        question: "¿Es seguro subir fotos privadas de mi familia?",
        answer: "Totalmente seguro. Tus fotos siguen siendo tuyas. Los archivos subidos se eliminan de forma automática y permanente de nuestros servidores en un plazo de 30 minutos.",
      },
      {
        question: "Tengo una foto antigua borrosa, ¿el sistema puede recuperar los detalles del rostro?",
        answer: "Sí, nuestro algoritmo está entrenado específicamente para identificar y reconstruir rostros desenfocados, devolviéndoles la nitidez, la textura de la piel y la claridad original.",
      },
      {
        question: "¿Qué pasa si la foto tiene una rotura o rasgadura profunda?",
        answer: "Podemos arreglar fotos dañadas con rasgaduras profundas, dobleces y rayones. El sistema analiza el contexto de la imagen y rellena los espacios perdidos de manera natural.",
      },
      {
        question: "¿Qué pasa si no me convence cómo queda la foto restaurada?",
        answer: "Ofrecemos una Garantía de Devolución de 30 Días (30-Day Money-Back Guarantee). Si no estás satisfecho con la calidad de tu restauración, te devolvemos tu dinero sin hacer preguntas.",
      },
    ],
    bottomCta: {
      title: "Rescata hoy los recuerdos que no quieres perder",
      subtitle: "Sube una foto antigua ahora y mira la diferencia en cuestión de segundos.",
      buttonText: "Empezar mi restauración gratis",
    },
  },
  "pt-br": {
    lang: "pt-br",
    locale: "pt-BR",
    slug: "/pt-br/restaurar-fotos-antigas",
    country: "Brasil",
    meta: {
      title: "Recuperar Fotos Antigas com IA | Restaurar Foto Rasgada e Desbotada",
      description: "Recupere fotos antigas manchadas, rasgadas ou desbotadas pela umidade. Restauração profissional com Inteligência Artificial em minutos, sem sair de casa.",
      keywords:[
        "recuperar fotos antigas", 
        "restaurar fotos antigas", 
        "foto antiga desbotada", 
        "foto rasgada", 
        "restauração de fotos com IA",
        "recuperar foto manchada"
      ],
    },
    hero: {
      h1: "Como recuperar fotos antigas e resgatar a história da sua família",
      subheadline: "Transforme retratos desbotados, rasgados ou danificados pela umidade em imagens nítidas de alta qualidade. Resultados de estúdio profissional em questão de segundos.",
      ctaText: "Restaurar minha foto agora",
      trustBadge: "Mais de 2.915 famílias no Brasil já confiam no BringBack",
    },
    sectionTitles: {
      showcase: "Resultados reais de restauração",
      benefits: "Por que digitalizar e restaurar hoje mesmo",
      howItWorks: "Como funciona",
      testimonials: "Histórias de famílias reais",
      faqs: "Perguntas frequentes",
      stepLabel: "Passo",
    },
    showcaseCaptions:[
      {
        beforeLabel: "Antes",
        afterLabel: "Depois",
        caption: "Foto de casamento dos anos 80, com arranhões severos e dobra central, totalmente restaurada.",
        beforeImage: "/scratched.webp",
        afterImage: "/scratched-restored.webp",
      },
      {
        beforeLabel: "Antes",
        afterLabel: "Depois",
        caption: "Retrato antigo severamente desbotado e amarelado pelo tempo, recuperado com contraste natural e nitidez.",
        beforeImage: "/yellowandfaded.webp",
        afterImage: "/yellowandfaded-restored.webp",
      },
    ],
    howItWorks:[
      {
        step: 1,
        title: "Envie sua foto com segurança",
        description: "Tire uma foto da sua imagem impressa com o celular ou use um scanner. Faça o upload direto no navegador, sem precisar instalar nenhum aplicativo.",
      },
      {
        step: 2,
        title: "A Inteligência Artificial trabalha",
        description: "Nosso sistema analisa os pixels para corrigir danos estruturais, como uma foto rasgada, removendo manchas de umidade e devolvendo a cor original.",
      },
      {
        step: 3,
        title: "Baixe e emocione a família",
        description: "Receba o arquivo em alta resolução (1080p), pronto para ser impresso, colocado em um porta-retratos ou enviado no grupo da família no WhatsApp.",
      },
    ],
    trustAndPrivacy: {
      title: "Privacidade absoluta para as suas memórias",
      description: "Sabemos que fotos de família são o seu maior tesouro. Nosso sistema foi criado para proteger sua privacidade desde o momento do upload.",
      policy: "Suas fotos continuam sendo exclusivamente suas. Os arquivos enviados são excluídos automática e permanentemente dos nossos servidores em um prazo máximo de 30 minutos.",
    },
    benefitsSection: {
      title: "O clima tropical está destruindo suas fotos. Pare o tempo.",
      subtitle: "Calor, umidade e o plástico dos álbuns antigos são fatais para o papel fotográfico. Proteja seu acervo hoje.",
      cards:[
        {
          title: "O inimigo silencioso: Umidade e Mofo",
          description: "No Brasil, é comum as fotos grudarem no vidro do porta-retratos ou desenvolverem fungos e manchas amarelas devido à umidade. Digitalizar e restaurar é a única forma de salvar a imagem antes que ela desapareça.",
          icon: "CloudRain",
          variant: "dark",
          colSpan: 2,
        },
        {
          title: "Herança Digital Eterna",
          description: "O papel rasga e se perde em mudanças. Uma cópia digital restaurada em alta qualidade dura para sempre.",
          icon: "Archive",
          variant: "light",
          colSpan: 1,
        },
        {
          title: "Um Presente Inesquecível",
          description: "Não há presente melhor para o Dia das Mães, Dia dos Pais ou aniversários do que devolver uma memória nítida de quem eles amam.",
          icon: "Heart",
          variant: "orange",
          colSpan: 1,
        },
        {
          title: "Conheça quem veio antes de você",
          description: "Muitos perguntam: 'É possível ter um retrato falado do meu avô que nunca conhecemos?'. Com nossa IA, você pode limpar e até animar fotos antigas de antepassados para ver seus rostos com clareza.",
          icon: "Users",
          variant: "light",
          colSpan: 2,
        },
      ],
    },
    pricing: {
      title: "Planos simples e acessíveis",
      subtitle: "Sem assinaturas mensais ou surpresas. Compre créditos e use quando precisar.",
      plans:[
        {
          name: "Starter",
          price: "$4.99",
          description: "Perfeito para testar e recuperar fotos antigas com alta qualidade.",
          badge: "Pagamento único",
          details:[
            "5 créditos de restauração",
            "Saída em alta resolução",
            "Melhoria/Upscale de imagem grátis",
            "Os créditos nunca expiram",
            "Garantia de devolução de 30 dias"
          ],
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "O melhor custo-benefício para restaurar e dar vida às suas fotos.",
          badge: "Mais Popular",
          details:[
            "20 créditos flexíveis",
            "Use para restaurar fotos",
            "OU crie animações em vídeo",
            "Saída em alta resolução 1080p",
            "Os créditos nunca expiram",
            "Garantia de devolução de 30 dias"
          ],
          featured: true,
        },
        {
          name: "Família",
          price: "$21.99",
          description: "Ideal para digitalizar e recuperar o álbum de família inteiro.",
          badge: "Pagamento único",
          details:[
            "60 créditos flexíveis",
            "Use para restaurar fotos",
            "OU crie animações em vídeo",
            "Saída em alta resolução 1080p",
            "Os créditos nunca expiram",
            "Garantia de devolução de 30 dias"
          ],
        },
      ],
    },
    localCostComparison: {
      title: "Por que o BringBack AI é a escolha inteligente no Brasil",
      studioCost: "Estúdios Fotográficos Físicos: Cobram de R$ 150 a R$ 500 para restaurar uma única foto, com prazo de 15 a 30 dias.",
      bringBackCost: "BringBack AI: Custos a partir de centavos de dólar por foto restaurada.",
      turnaround: "Tempo de entrega: Minutos na nossa plataforma online vs. Semanas de espera nas lojas físicas.",
      summary: "Estúdios tradicionais cobram por horas de trabalho manual no Photoshop. Ao utilizar nossa tecnologia focada em restauração, você obtém resultados profissionais por uma fração do preço, sem o risco de enviar seus originais raros pelo correio.",
    },
    testimonials:[
      {
        name: "Ana Clara Souza",
        location: "São Paulo, SP",
        quote: "Tinha uma foto antiga desbotada dos meus bisavós que estava colada no plástico do álbum e cheia de manchas de umidade. O site limpou o rosto deles perfeitamente. Mandei no grupo da família e todos se emocionaram.",
      },
      {
        name: "Carlos Eduardo Mendes",
        location: "Recife, PE",
        quote: "Consegui recuperar uma foto rasgada bem no meio do rosto do meu pai. O reparo ficou tão natural que nem parece que o papel estava partido. E o melhor: não precisei sair de casa.",
      },
      {
        name: "Juliana Ferreira",
        location: "Belo Horizonte, MG",
        quote: "Fiz orçamento em três lojas aqui na cidade e queriam cobrar quase 300 reais por foto. Aqui eu restaurei mais de 10 fotos da minha infância pagando muito menos. A qualidade é excelente.",
      },
    ],
    faq:[
      {
        question: "É seguro enviar fotos íntimas e familiares para o site?",
        answer: "Sim, é 100% seguro. Suas fotos permanecem privadas. Os arquivos que você envia são excluídos de forma automática e permanente dos nossos servidores dentro de 30 minutos após o processamento.",
      },
      {
        question: "Tenho uma foto antiga desbotada e sem foco. A IA consegue arrumar?",
        answer: "Sim. Nosso algoritmo é especializado em detectar rostos borrados e reconstruir a nitidez, textura da pele e detalhes perdidos, além de recuperar o contraste e as cores de fotos desbotadas pelo sol.",
      },
      {
        question: "Vocês conseguem restaurar foto rasgada ou com pedaços faltando?",
        answer: "Sim, o sistema consegue unir as partes de uma foto rasgada, remover marcas de dobras severas e preencher pequenos espaços danificados de forma natural.",
      },
      {
        question: "E se eu não ficar satisfeito com a restauração?",
        answer: "Oferecemos uma Garantia de Devolução do Dinheiro de 30 dias. Se a restauração não atender às suas expectativas, devolvemos seu pagamento de forma rápida e sem burocracia.",
      },
    ],
    bottomCta: {
      title: "Resgate as memórias que você não quer perder",
      subtitle: "Faça o upload de uma foto antiga agora mesmo e veja a diferença em poucos segundos.",
      buttonText: "Começar minha restauração",
    },
  },
  id: {
    lang: "id",
    locale: "id-ID",
    slug: "/id/ai-foto-keluarga",
    country: "Indonesia",
    meta: {
      title: "AI Foto Keluarga | Restorasi & Edit Foto Keluarga Lama Menjadi Baru",
      description: "Gunakan AI untuk foto keluarga agar kenangan lama yang pudar, robek, atau terkena air kembali tajam. Coba edit foto keluarga AI gratis resolusi tinggi sekarang.",
      keywords:[
        "ai untuk foto keluarga", 
        "ai foto keluarga gratis", 
        "ai menggabungkan foto keluarga", 
        "gabungkan foto keluarga ai", 
        "edit foto keluarga ai gratis",
        "restorasi foto lama"
      ],
    },
    hero: {
      h1: "Gunakan AI untuk foto keluarga dan selamatkan kenangan lama Anda",
      subheadline: "Perbaiki foto orang tua dan kakek-nenek yang pudar, robek, atau rusak karena kelembapan. Dapatkan hasil resolusi tinggi seketika tanpa harus pergi ke studio foto.",
      ctaText: "Restorasi foto saya sekarang",
      trustBadge: "Dipercaya oleh lebih dari 1.188 keluarga di seluruh Indonesia",
    },
    sectionTitles: {
      showcase: "Hasil restorasi nyata",
      benefits: "Mengapa Anda harus digitalisasi foto sekarang",
      howItWorks: "Cara kerja",
      testimonials: "Cerita keluarga Indonesia",
      faqs: "Pertanyaan yang sering diajukan",
      stepLabel: "Langkah",
    },
    showcaseCaptions:[
      {
        beforeLabel: "Sebelum",
        afterLabel: "Sesudah",
        caption: "Foto pernikahan tahun 90-an dengan noda air dan jamur parah, berhasil dipulihkan total.",
        beforeImage: "/water-damaged.webp",
        afterImage: "/water-damage-restored.webp",
      },
      {
        beforeLabel: "Sebelum",
        afterLabel: "Sesudah",
        caption: "Retret keluarga usang yang menguning dan pudar, kembali tajam dengan warna alami.",
        beforeImage: "/under-exposed.webp",
        afterImage: "/under-exposed-restored.webp",
      },
    ],
    howItWorks:[
      {
        step: 1,
        title: "Unggah foto dengan aman",
        description: "Gunakan kamera HP Anda untuk memotret foto fisik dari album lama, lalu unggah langsung ke website kami. Tanpa perlu install aplikasi.",
      },
      {
        step: 2,
        title: "Kecerdasan Buatan (AI) bekerja",
        description: "Dalam hitungan detik, sistem kami akan menganalisis piksel, menghilangkan goresan, noda air, dan memperjelas wajah yang buram secara otomatis.",
      },
      {
        step: 3,
        title: "Unduh dan bagikan ke keluarga",
        description: "Simpan hasil foto dalam resolusi tinggi (1080p). Sangat cocok untuk dicetak ulang, dibingkai, atau dikirimkan ke grup WhatsApp keluarga.",
      },
    ],
    trustAndPrivacy: {
      title: "Privasi mutlak untuk kenangan pribadi Anda",
      description: "Kami memahami bahwa foto keluarga adalah dokumen yang sangat pribadi dan berharga. Sistem kami dirancang untuk menjaga keamanan data Anda sejak detik pertama.",
      policy: "Foto Anda tetap menjadi milik Anda sepenuhnya. Semua file yang diunggah akan dihapus secara otomatis dan permanen dari server kami dalam waktu maksimal 30 menit.",
    },
    benefitsSection: {
      title: "Iklim tropis sedang merusak foto cetak Anda. Hentikan sekarang.",
      subtitle: "Kelembapan, panas, dan plastik album tua adalah musuh utama kertas foto. Lindungi warisan Anda hari ini.",
      cards:[
        {
          title: "Musuh Utama: Kelembapan & Jamur",
          description: "Di Indonesia, sangat umum foto lama menjadi lengket di kaca pigura atau dipenuhi bintik kuning karena jamur. Digitalisasi dengan AI adalah satu-satunya cara untuk menyelamatkan gambar sebelum hilang selamanya.",
          icon: "Droplets",
          variant: "dark",
          colSpan: 2,
        },
        {
          title: "Warisan Digital Abadi",
          description: "Kertas bisa sobek, luntur, atau rusak karena banjir. Salinan digital dalam resolusi tinggi akan bertahan selamanya untuk anak cucu Anda.",
          icon: "Archive",
          variant: "light",
          colSpan: 1,
        },
        {
          title: "Kejutan Spesial Lebaran",
          description: "Momen kumpul keluarga saat Idul Fitri atau acara keluarga adalah waktu terbaik untuk memamerkan foto kakek-nenek yang telah direstorasi.",
          icon: "Users",
          variant: "orange",
          colSpan: 1,
        },
        {
          title: "Kualitas Studio di Rumah Anda",
          description: "Tidak perlu lagi menyerahkan foto satu-satunya yang Anda miliki ke orang asing di studio foto. Lakukan semuanya sendiri dari rumah dengan aman.",
          icon: "Shield",
          variant: "light",
          colSpan: 2,
        },
      ],
    },
    pricing: {
      title: "Paket harga yang transparan dan terjangkau",
      subtitle: "Tanpa biaya langganan bulanan. Beli kredit dan gunakan kapan saja Anda butuh.",
      plans:[
        {
          name: "Starter",
          price: "$4.99",
          description: "Pilihan tepat untuk mencoba kualitas restorasi tingkat tinggi.",
          badge: "Sekali Bayar",
          details:[
            "5 Kredit restorasi",
            "Hasil resolusi tinggi",
            "Gratis fitur perjelas (Upscale)",
            "Kredit tidak pernah kedaluwarsa",
            "Garansi uang kembali 30 hari"
          ],
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "Nilai terbaik untuk memperbaiki foto dan membuatnya bergerak.",
          badge: "Paling Populer",
          details:[
            "20 Kredit fleksibel",
            "Gunakan untuk restorasi foto",
            "ATAU buat animasi video",
            "Output resolusi tinggi 1080p",
            "Kredit tidak pernah kedaluwarsa",
            "Garansi uang kembali 30 hari"
          ],
          featured: true,
        },
        {
          name: "Family",
          price: "$21.99",
          description: "Didesain untuk mendigitalisasi seluruh album kenangan keluarga.",
          badge: "Sekali Bayar",
          details:[
            "60 Kredit fleksibel",
            "Gunakan untuk restorasi foto",
            "ATAU buat animasi video",
            "Output resolusi tinggi 1080p",
            "Kredit tidak pernah kedaluwarsa",
            "Garansi uang kembali 30 hari"
          ],
        },
      ],
    },
    localCostComparison: {
      title: "Mengapa BringBack AI lebih cerdas dan hemat",
      studioCost: "Studio Foto Fisik (Jakarta/Surabaya): Mematok harga mulai dari Rp 300.000 hingga Rp 800.000 untuk memperbaiki satu foto rusak, dengan waktu tunggu 1-2 minggu.",
      bringBackCost: "BringBack AI: Biaya sangat terjangkau, hanya belasan ribu rupiah per foto.",
      turnaround: "Waktu pengerjaan: Hitungan detik di layar Anda vs. Berminggu-minggu di toko fisik.",
      summary: "Studio tradisional mengenakan biaya mahal untuk pengerjaan manual di Photoshop. Dengan teknologi kami, Anda mendapatkan kualitas profesional jauh lebih murah, instan, dan tanpa risiko kehilangan foto fisik di jalan.",
    },
    testimonials:[
      {
        name: "Dewi Lestari",
        location: "Jakarta Pusat",
        quote: "Banyak foto keluarga saya rusak terkena air banjir tahun lalu dan warnanya memudar. Saya mencoba edit foto keluarga ai gratis di sini, dan ajaibnya detail wajah ayah saya kembali tajam sempurna.",
      },
      {
        name: "Budi Santoso",
        location: "Surabaya, Jawa Timur",
        quote: "Saya punya satu-satunya foto kakek yang sobek parah di tengah. BringBack bisa gabungkan foto keluarga ai yang robek itu menjadi satu kesatuan utuh lagi. Hasil cetaknya sangat memuaskan.",
      },
      {
        name: "Sari Wulandari",
        location: "Bandung, Jawa Barat",
        quote: "Dulu pernah tanya ke studio foto biayanya mahal sekali. Di website ini saya bisa restorasi foto masa kecil saya yang berjamur dengan harga sangat murah. Fitur AI untuk foto keluarga ini benar-benar membantu.",
      },
    ],
    faq:[
      {
        question: "Apakah aman mengunggah foto pribadi ke website ini?",
        answer: "Sangat aman. Foto Anda tetap menjadi privasi Anda. Semua file yang Anda unggah akan dihapus secara otomatis dan permanen dari server kami dalam waktu 30 menit setelah diproses.",
      },
      {
        question: "Apakah saya bisa edit foto keluarga ai gratis di sini?",
        answer: "Kami menyediakan fitur peningkatan resolusi (upscale) dasar secara gratis. Untuk perbaikan kerusakan parah (robek, jamur, noda air), Anda bisa menggunakan paket Starter kami yang sangat terjangkau.",
      },
      {
        question: "Apakah sistem ini bisa ai menggabungkan foto keluarga yang robek terbelah?",
        answer: "Ya, teknologi AI kami dirancang untuk menyatukan kembali dan memperbaiki bagian foto yang robek parah atau terlipat, sehingga terlihat utuh dan natural kembali tanpa bekas potongan.",
      },
      {
        question: "Bagaimana jika saya tidak puas dengan hasil restorasinya?",
        answer: "Kami memberikan Garansi Uang Kembali 30 Hari (30-Day Money-Back Guarantee). Jika hasil perbaikan foto tidak sesuai harapan, kami akan mengembalikan dana Anda tanpa proses yang rumit.",
      },
    ],
    bottomCta: {
      title: "Selamatkan memori berharga keluarga Anda hari ini",
      subtitle: "Unggah foto lama Anda sekarang dan saksikan perubahannya dalam hitungan detik.",
      buttonText: "Mulai Restorasi Foto Saya",
    },
  },
 de: {
    lang: "de",
    locale: "de-DE",
    slug: "/de/alte-fotos-zum-leben-erwecken",
    country: "Deutschland",
    meta: {
      title: "Alte Fotos zum Leben erwecken | KI Bildrestauration & Reparatur",
      description: "Reparieren Sie gerissene, verblasste oder beschädigte alte Bilder in Sekunden. Nutzen Sie unsere KI, um alte Fotos zum Leben zu erwecken und Erinnerungen zu bewahren.",
      keywords:[
        "alte fotos zum leben erwecken",
        "alte bilder zum leben erwecken",
        "ki familienfoto erstellen kostenlos",
        "altes bild zum leben erwecken",
        "fotos restaurieren",
        "alte fotos reparieren"
      ],
    },
    hero: {
      h1: "Alte Fotos zum Leben erwecken und die Familiengeschichte retten",
      subheadline: "Reparieren Sie verblasste, gerissene oder durch Feuchtigkeit beschädigte alte Bilder in Sekundenschnelle. Holen Sie sich professionelle Studioqualität direkt nach Hause.",
      ctaText: "Jetzt mein Foto restaurieren",
      trustBadge: "Über 940 Familien in Deutschland vertrauen bereits BringBack",
    },
    sectionTitles: {
      showcase: "Echte Restaurationsergebnisse",
      benefits: "Warum Sie Ihre Bilder noch heute digitalisieren sollten",
      howItWorks: "So funktioniert es",
      testimonials: "Geschichten echter Familien",
      faqs: "Häufig gestellte Fragen",
      stepLabel: "Schritt",
    },
    showcaseCaptions:[
      {
        beforeLabel: "Vorher",
        afterLabel: "Nachher",
        caption: "Hochzeitsfoto der Großeltern mit tiefen Rissen und Wasserflecken, vollständig restauriert.",
        beforeImage: "/torn.webp",
        afterImage: "/torn-restored.webp",
      },
      {
        beforeLabel: "Vorher",
        afterLabel: "Nachher",
        caption: "Stark verblasstes und vergilbtes Kinderportrait, mit natürlichen Farben und scharfen Details wiederhergestellt.",
        beforeImage: "/faded.webp",
        afterImage: "/fade-restored.webp",
      },
    ],
    howItWorks:[
      {
        step: 1,
        title: "Laden Sie Ihr Foto sicher hoch",
        description: "Fotografieren Sie Ihr ausgedrucktes Bild einfach mit dem Smartphone ab oder nutzen Sie einen Scanner. Laden Sie es ohne App-Installation direkt im Browser hoch.",
      },
      {
        step: 2,
        title: "Die Künstliche Intelligenz arbeitet",
        description: "In wenigen Sekunden analysiert unser System das Bild, um Risse zu füllen, Flecken zu entfernen und unscharfe Gesichter wieder klar und deutlich zu machen.",
      },
      {
        step: 3,
        title: "Herunterladen und Freude teilen",
        description: "Speichern Sie Ihr restauriertes Bild in hoher Auflösung (1080p) ab – perfekt zum Ausdrucken, Einrahmen oder Teilen in der Familien-WhatsApp-Gruppe.",
      },
    ],
    trustAndPrivacy: {
      title: "Absolute Privatsphäre für Ihre wertvollsten Erinnerungen",
      description: "Wir wissen, dass private Familienfotos Ihr größter Schatz sind. Unser System ist strikt darauf ausgelegt, Ihre Privatsphäre ab dem ersten Klick zu schützen.",
      policy: "Ihre Fotos gehören ausschließlich Ihnen. Hochgeladene Dateien werden innerhalb von 30 Minuten automatisch und dauerhaft von unseren Servern gelöscht.",
    },
    benefitsSection: {
      title: "Der Zahn der Zeit zerstört Ihre Papierfotos. Stoppen Sie ihn.",
      subtitle: "Feuchte Keller und heiße Dachböden in Deutschland ruinieren wertvolle Familienalben. Schützen Sie Ihr Erbe noch heute.",
      cards:[
        {
          title: "Der unsichtbare Feind: Feuchtigkeit & Hitze",
          description: "Viele lagern ihre Fotoalben im feuchten Keller oder auf dem Dachboden. Temperaturschwankungen führen dazu, dass Bilder vergilben, zusammenkleben oder Stockflecken bekommen. Die digitale Restauration ist der einzige Weg, diesen Verfall zu stoppen.",
          icon: "Droplets",
          variant: "dark",
          colSpan: 2,
        },
        {
          title: "Ewige digitale Sicherung",
          description: "Papier reißt und Kisten gehen bei Umzügen verloren. Eine hochauflösende digitale Kopie hält ewig und kann von Generation zu Generation weitergegeben werden.",
          icon: "Archive",
          variant: "light",
          colSpan: 1,
        },
        {
          title: "Ein unvergessliches Geschenk",
          description: "Es gibt kein emotionaleres Geschenk zur Goldenen Hochzeit, zu runden Geburtstagen oder zu Weihnachten als ein makelloses Foto aus der Vergangenheit.",
          icon: "Heart",
          variant: "orange",
          colSpan: 1,
        },
        {
          title: "Gesichter der Vorfahren neu entdecken",
          description: "Wenn Sie ein altes Bild zum Leben erwecken, geben Sie der nächsten Generation die Chance, ihre Urgroßeltern in klarer Qualität zu sehen, fast so, als wären sie heute aufgenommen worden.",
          icon: "Users",
          variant: "light",
          colSpan: 2,
        },
      ],
    },
    pricing: {
      title: "Transparente und faire Preise",
      subtitle: "Keine versteckten Abonnements. Sie kaufen Credits und nutzen sie, wann immer Sie möchten.",
      plans:[
        {
          name: "Starter",
          price: "$4.99",
          description: "Perfekt, um unsere hochwertige Fotorestauration zu testen.",
          badge: "Einmalzahlung",
          details:[
            "5 Restaurations-Credits",
            "Hochauflösendes Ergebnis",
            "Kostenlose Bildverbesserung (Upscaling)",
            "Credits verfallen nie",
            "30-Tage-Geld-zurück-Garantie"
          ],
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "Das beste Preis-Leistungs-Verhältnis für Restauration und Animation.",
          badge: "Bester Wert",
          details:[
            "20 flexible Credits",
            "Nutzen für Fotorestauration",
            "ODER für Video-Animationen",
            "Hochauflösendes Ergebnis (1080p)",
            "Credits verfallen nie",
            "30-Tage-Geld-zurück-Garantie"
          ],
          featured: true,
        },
        {
          name: "Family",
          price: "$21.99",
          description: "Entwickelt, um ganze Familienalben digital zu retten.",
          badge: "Einmalzahlung",
          details:[
            "60 flexible Credits",
            "Nutzen für Fotorestauration",
            "ODER für Video-Animationen",
            "Hochauflösendes Ergebnis (1080p)",
            "Credits verfallen nie",
            "30-Tage-Geld-zurück-Garantie"
          ],
        },
      ],
    },
    localCostComparison: {
      title: "Warum BringBack AI die kluge Entscheidung ist",
      studioCost: "Lokale Fotostudios (Berlin/München): Verlangen oft 30 € bis über 100 € für die Reparatur eines einzigen Fotos. Die Wartezeit beträgt oft 1 bis 3 Wochen.",
      bringBackCost: "BringBack AI: Die Kosten belaufen sich auf nur wenige Cent pro restauriertem Foto.",
      turnaround: "Bearbeitungszeit: Wenige Sekunden auf Ihrem Bildschirm vs. Wochen im Fotoladen.",
      summary: "Traditionelle Studios berechnen teure Handarbeit in Photoshop. Mit unserer spezialisierten Technologie erhalten Sie professionelle Qualität zu einem Bruchteil des Preises – sofort und ohne das Risiko, Ihre wertvollen Originale per Post einsenden zu müssen.",
    },
    testimonials:[
      {
        name: "Klaus M.",
        location: "München, Bayern",
        quote: "Ich wollte ein altes Bild zum Leben erwecken, das bei einem Wasserschaden im Keller stark gelitten hatte. Das System hat die Flecken entfernt und das Gesicht meines Vaters absolut scharf wiederhergestellt.",
      },
      {
        name: "Sabine W.",
        location: "Berlin",
        quote: "Ich habe nach einer Möglichkeit gesucht, ein zerrissenes Bild meiner Eltern zu reparieren. Die Risse wurden nahtlos zusammengefügt. Wenn man testen will, wie man ein KI Familienfoto erstellen kostenlos oder günstig umsetzen kann, ist der Starter-Plan genial.",
      },
      {
        name: "Thomas B.",
        location: "Hamburg",
        quote: "Die Fotos meiner Großeltern waren stark vergilbt und unscharf. Die Restaurierung hier dauerte keine Minute und das Ergebnis sieht aus, als wäre das Foto gestern aufgenommen worden. Sehr empfehlenswert!",
      },
    ],
    faq:[
      {
        question: "Ist es sicher, private Familienfotos auf diese Website hochzuladen?",
        answer: "Ja, absolut sicher. Ihre Fotos bleiben zu 100 % privat. Alle hochgeladenen Dateien werden nach der Bearbeitung innerhalb von 30 Minuten automatisch und dauerhaft von unseren Servern gelöscht.",
      },
      {
        question: "Ich habe ein altes, unscharfes Foto. Kann das System Details im Gesicht wiederherstellen?",
        answer: "Ja. Unser Algorithmus ist darauf spezialisiert, unscharfe Gesichter zu erkennen und Schärfe, Hautstrukturen und verlorene Details originalgetreu zu rekonstruieren.",
      },
      {
        question: "Können Sie alte bilder zum leben erwecken, die in der Mitte zerrissen sind?",
        answer: "Ja, unser System kann die Teile eines zerrissenen Fotos wieder zusammenfügen, tiefe Knicke entfernen und kleine fehlende Stellen natürlich auffüllen, sodass das Bild wieder als Ganzes wirkt.",
      },
      {
        question: "Was passiert, wenn mir das restaurierte Foto nicht gefällt?",
        answer: "Wir bieten eine 30-Tage-Geld-zurück-Garantie (30-Day Money-Back Guarantee). Sollte die Restauration nicht Ihren Erwartungen entsprechen, erstatten wir Ihnen den Kaufbetrag ohne komplizierte Rückfragen.",
      },
    ],
    bottomCta: {
      title: "Retten Sie heute die Erinnerungen, die Sie nicht verlieren möchten",
      subtitle: "Laden Sie jetzt ein altes Foto hoch und sehen Sie den Unterschied in wenigen Sekunden.",
      buttonText: "Jetzt Restauration starten",
    },
  },
  ru: {
    lang: "ru",
    locale: "ru-RU",
    slug: "/ru/ozhivit-foto",
    country: "Россия и СНГ",
    meta: {
      title: "Оживить фото с помощью ИИ | Реставрация старых снимков",
      description: "Узнайте, как оживить фото и восстановить старые, порванные или выцветшие снимки за секунды. Профессиональная реставрация с помощью нейросетей без посещения фотосалона.",
      keywords:[
        "оживить фото", 
        "оживи фото", 
        "семейный портрет из разных фото онлайн", 
        "реставрация старых фотографий", 
        "улучшить качество старого фото",
        "восстановить порванное фото"
      ],
    },
    hero: {
      h1: "Как оживить фото и сохранить историю вашей семьи навсегда",
      subheadline: "Восстановите выцветшие, порванные или поврежденные влагой старые снимки за несколько секунд. Качество профессионального фотосалона прямо у вас дома.",
      ctaText: "Оживить мое фото сейчас",
      trustBadge: "Более 450 семей в России и СНГ уже доверяют BringBack",
    },
    sectionTitles: {
      showcase: "Реальные результаты реставрации",
      benefits: "Почему важно оцифровать старые альбомы именно сейчас",
      howItWorks: "Как это работает",
      testimonials: "Истории реальных семей",
      faqs: "Частые вопросы",
      stepLabel: "Шаг",
    },
    showcaseCaptions:[
      {
        beforeLabel: "До",
        afterLabel: "После",
        caption: "Свадебное фото 70-х годов с глубокими заломами и пожелтением, полностью восстановленное.",
        beforeImage: "/torn.webp",
        afterImage: "/torn-restored.webp",
      },
      {
        beforeLabel: "До",
        afterLabel: "После",
        caption: "Сильно выцветший детский портрет, которому вернули естественный контраст и четкость лица.",
        beforeImage: "/faded.webp",
        afterImage: "/fade-restored.webp",
      },
    ],
    howItWorks:[
      {
        step: 1,
        title: "Безопасно загрузите фото",
        description: "Сфотографируйте старый снимок на камеру смартфона или используйте сканер. Загрузите файл в браузер без установки дополнительных приложений.",
      },
      {
        step: 2,
        title: "Искусственный интеллект работает",
        description: "За считанные секунды алгоритм анализирует изображение: убирает царапины, пятна от воды, склеивает разрывы и возвращает резкость размытым лицам.",
      },
      {
        step: 3,
        title: "Скачайте и поделитесь с близкими",
        description: "Сохраните готовое фото в высоком разрешении (1080p). Оно идеально подойдет для печати, семейного архива или отправки родственникам в мессенджерах.",
      },
    ],
    trustAndPrivacy: {
      title: "Абсолютная конфиденциальность ваших воспоминаний",
      description: "Мы понимаем, что семейные фотографии — это ваша личная история. Наша система создана так, чтобы защищать ваши данные с первой секунды.",
      policy: "Ваши фотографии остаются только вашими. Загруженные файлы автоматически и навсегда удаляются с наших серверов в течение 30 минут после обработки.",
    },
    benefitsSection: {
      title: "Время и климат разрушают бумажные фото. Остановите этот процесс.",
      subtitle: "Хранение альбомов на даче, балконе или в подвале — главная причина гибели снимков. Защитите свое наследие.",
      cards:[
        {
          title: "Главный враг: Сырость и перепады температур",
          description: "В России старые фото часто хранятся на неотапливаемых дачах или балконах. Из-за сырости снимки склеиваются, покрываются плесенью и желтыми пятнами. Цифровая реставрация — единственный способ спасти изображение.",
          icon: "Droplets",
          variant: "dark",
          colSpan: 2,
        },
        {
          title: "Вечный цифровой архив",
          description: "Бумага рвется и теряется при переездах. Цифровая копия в высоком разрешении останется с вами навсегда и перейдет к детям.",
          icon: "Archive",
          variant: "light",
          colSpan: 1,
        },
        {
          title: "Идеальная база для коллажей",
          description: "Многие хотят собрать всех родственников вместе. Если вы создаете семейный портрет из разных фото онлайн, наша нейросеть поможет улучшить каждое старое лицо до идеального качества перед склейкой.",
          icon: "Users",
          variant: "orange",
          colSpan: 1,
        },
        {
          title: "Студийное качество без выхода из дома",
          description: "Больше не нужно отдавать единственный экземпляр ценного фото чужим людям в салоне и ждать неделями. Сделайте все сами, безопасно и быстро.",
          icon: "Shield",
          variant: "light",
          colSpan: 2,
        },
      ],
    },
    pricing: {
      title: "Простые и понятные тарифы",
      subtitle: "Никаких скрытых подписок. Покупайте кредиты и используйте их, когда вам удобно.",
      plans:[
        {
          name: "Starter",
          price: "$4.99",
          description: "Идеально для качественной реставрации первых фотографий.",
          badge: "Разовый платеж",
          details:[
            "5 кредитов на реставрацию",
            "Высокое разрешение на выходе",
            "Бесплатное улучшение (Upscale)",
            "Кредиты не сгорают",
            "30-дневная гарантия возврата денег"
          ],
        },
        {
          name: "Pro",
          price: "$9.99",
          description: "Лучший выбор, чтобы восстановить снимки и оживить фото видео-анимацией.",
          badge: "Популярный выбор",
          details:[
            "20 гибких кредитов",
            "Используйте для реставрации",
            "ИЛИ для видео-анимации лиц",
            "Высокое разрешение 1080p",
            "Кредиты не сгорают",
            "30-дневная гарантия возврата денег"
          ],
          featured: true,
        },
        {
          name: "Family",
          price: "$21.99",
          description: "Создан для полной оцифровки больших семейных альбомов.",
          badge: "Разовый платеж",
          details:[
            "60 гибких кредитов",
            "Используйте для реставрации",
            "ИЛИ для видео-анимации лиц",
            "Высокое разрешение 1080p",
            "Кредиты не сгорают",
            "30-дневная гарантия возврата денег"
          ],
        },
      ],
    },
    localCostComparison: {
      title: "Почему BringBack AI — это разумный выбор",
      studioCost: "Обычный фотосалон (Москва/СПб): Реставрация одного сложного снимка стоит от 1500 до 5000 рублей, а ожидание заказа занимает от 3 до 14 дней.",
      bringBackCost: "BringBack AI: Стоимость обработки одного фото составляет меньше доллара.",
      turnaround: "Время выполнения: Секунды на вашем экране против недель в фотоателье.",
      summary: "Традиционные студии берут деньги за часы ручной работы в Photoshop. Используя наши технологии, вы получаете профессиональное качество в десятки раз дешевле, мгновенно и без риска потерять оригинал при доставке.",
    },
    testimonials:[
      {
        name: "Елена С.",
        location: "Москва",
        quote: "Я давно искала способ оживить фото моего прадедушки. Снимок был сильно поцарапан и помят. Сайт убрал все дефекты, и теперь мы смогли распечатать большой портрет для семейного архива.",
      },
      {
        name: "Дмитрий В.",
        location: "Санкт-Петербург",
        quote: "Моя мама собирала семейный портрет из разных фото онлайн, и некоторые старые вырезки были очень размытыми. Я прогнал их через BringBack — лица стали невероятно четкими! Коллаж получился идеальным.",
      },
      {
        name: "Анна К.",
        location: "Екатеринбург",
        quote: "В фотосалоне за восстановление снимка с пятнами от воды запросили 3000 рублей. Здесь я сделала это почти бесплатно и за одну минуту. Просто оживи фото в один клик. Качество супер.",
      },
    ],
    faq:[
      {
        question: "Безопасно ли загружать сюда личные семейные снимки?",
        answer: "Абсолютно безопасно. Ваши фотографии остаются полностью конфиденциальными. Загруженные файлы автоматически и навсегда удаляются с наших серверов в течение 30 минут.",
      },
      {
        question: "У меня очень старое и размытое фото. Сможет ли система вернуть детали лица?",
        answer: "Да. Наш алгоритм специально обучен распознавать размытые лица и восстанавливать резкость, текстуру кожи и утраченные детали, возвращая снимку первоначальную четкость.",
      },
      {
        question: "Справится ли ИИ, если фото порвано пополам?",
        answer: "Да, система способна бесшовно соединять разорванные части фотографии, удалять глубокие заломы и естественно заполнять небольшие утраченные фрагменты изображения.",
      },
      {
        question: "Что делать, если мне не понравится результат реставрации?",
        answer: "Мы предоставляем 30-дневную гарантию возврата средств (30-Day Money-Back Guarantee). Если качество восстановления вас не устроит, мы вернем деньги без лишних вопросов.",
      },
    ],
    bottomCta: {
      title: "Спасите бесценные кадры вашей семьи уже сегодня",
      subtitle: "Загрузите старое фото прямо сейчас и увидите разницу своими глазами за пару секунд.",
      buttonText: "Начать реставрацию",
    },
  },

}

export const supportedLanguages = Object.keys(countryPages) as SupportedLang[]
