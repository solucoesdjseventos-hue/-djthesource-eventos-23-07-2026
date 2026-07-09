export type ServiceOption = {
  label: string;
  description: string;
  price: number;
};

export type ServiceConfig = {
  id: string;
  title: string;
  description: string;
  rateLabel: string;
  unitLabel: string;
  basePrice: number;
  values: number[];
  editable: boolean;
  hourly: boolean;
  options?: ServiceOption[];
};

export const services: ServiceConfig[] = [
  {
    id: "sonorizacao",
    title: "Sonorização",
    description:
      "Som profissional para eventos com sistema de áudio de alta potência.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 300,
    values: [300, 350, 400, 450],
    editable: true,
    hourly: true,
    options: [
      {
        label: "Kit Palestra / Corporativo Pequeno",
        description:
          "2 caixas com pedestal + 1 mesa pequena + 2 microfones sem fio + cabos.",
        price: 180,
      },
      {
        label: "Kit Festa / DJ (até 150 pessoas)",
        description:
          "2 caixas principais + 1 ou 2 subwoofers + mesa de som + microfone.",
        price: 260,
      },
      {
        label: "Kit Banda / Show Médio",
        description:
          "Sistema line array ou caixas de alta potência + mesa digital + kit de microfones + retornos.",
        price: 420,
      },
    ],
  },
  {
    id: "iluminacao",
    title: "Iluminação",
    description:
      "Iluminação cênica e moving heads para efeitos modernos e sensoriais.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 280,
    values: [280, 320, 360, 400],
    editable: true,
    hourly: true,
    options: [
      {
        label: "Iluminação Cênica Simples",
        description:
          "8 a 10 refletores Par LED para ambientar o salão ou destacar pontos específicos.",
        price: 180,
      },
      {
        label: "Pista de Dança Clássica",
        description:
          "1 trave de box truss + 2 moving heads + 4 par LEDs + 1 máquina de fumaça + 1 estrobo.",
        price: 320,
      },
      {
        label: "Pista de Dança Premium",
        description:
          "Estrutura em X ou quadrado com 4 a 8 moving heads potentes, estrobos, lasers, máquina haze e ribaltas de LED.",
        price: 560,
      },
    ],
  },
  {
    id: "garcons",
    title: "Garçons",
    description:
      "Equipe de garçons profissional para atendimento de convidados.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 40,
    values: [40, 45, 50, 55],
    editable: true,
    hourly: true,
  },
  {
    id: "recepcionistas",
    title: "Recepcionistas",
    description:
      "Recepção e organização de convidados com cordialidade e eficiência.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 45,
    values: [45, 50, 55, 60],
    editable: true,
    hourly: true,
  },
  {
    id: "djs",
    title: "DJ",
    description: "DJ com repertório personalizado para manter a festa animada.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 220,
    values: [220, 250, 280, 320],
    editable: true,
    hourly: true,
  },
  {
    id: "decoracao",
    title: "Decorador",
    description: "Decoração temática com ambientação completa para o salão.",
    rateLabel: "Valor por hora",
    unitLabel: "horas",
    basePrice: 75,
    values: [75, 90, 105, 120],
    editable: true,
    hourly: true,
  },
  {
    id: "salao",
    title: "Locação de Salão",
    description:
      "Salões adaptados conforme número de convidados e estrutura completa.",
    rateLabel: "Valor do salão",
    unitLabel: "convidados",
    basePrice: 0,
    values: [1500, 2200, 2900, 3600],
    editable: true,
    hourly: false,
  },
];
