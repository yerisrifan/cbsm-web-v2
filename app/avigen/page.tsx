// @ts-nocheck
"use client";

import React, { useState, useRef } from "react";
import {
  Settings2,
  Bird,
  Dna,
  GitBranch,
  AlertTriangle,
  ChevronDown,
  Activity,
  EggOff,
} from "lucide-react";

interface ColorSwatchProps {
  color1: string;
  color2: string;
  isLethal?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color1, color2, isLethal }) => (
  <div className="relative">
    <div
      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-200 shadow-sm ${isLethal ? "opacity-30" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 40%, ${color2} 60%)`,
      }}
    ></div>
    {isLethal && (
      <EggOff size={20} className="absolute inset-0 m-auto text-slate-500" />
    )}
  </div>
);

const MiniColorSwatch: React.FC<ColorSwatchProps> = ({ color1, color2, isLethal }) => (
  <div className="relative flex-shrink-0">
    <div
      className={`w-8 h-8 rounded-full border border-slate-300 shadow-sm ${isLethal ? "opacity-30" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 40%, ${color2} 60%)`,
      }}
    ></div>
    {isLethal && (
      <EggOff size={14} className="absolute inset-0 m-auto text-slate-500" />
    )}
  </div>
);

export default function App() {
  // Modes: 'mendel1_base', 'sex_linked_cin', 'mendel2_dom', 'mendel2_res'
  const [crossMode, setCrossMode] = useState("mendel2_dom");

  // Input State P1 (Sire) & P2 (Dam)
  const [p1Input, setP1Input] = useState("HkWw");
  const [p2Input, setP2Input] = useState("HKww");

  // Calculated States
  const [f1Data, setF1Data] = useState(null);
  const [f2Data, setF2Data] = useState(null);

  const [f2Parent1, setF2Parent1] = useState("");
  const [f2Parent2, setF2Parent2] = useState("");

  const f1Ref = useRef(null);
  const f2Ref = useRef(null);

  // --- Opsi Dropdown Berdasarkan Mode ---
  const getDropdownOptions = (mode, isMale) => {
    if (mode === "mendel1_base") {
      return [
        { val: "HH", label: "HH - Hijau Murni (Dominan)" },
        { val: "Hk", label: "Hk - Hijau Split Kuning (Carrier)" },
        { val: "HK", label: "HK - Bond (Bercak Hijau-Kuning)" },
        { val: "kk", label: "kk - Kuning Murni (Resesif)" },
      ];
    } else if (mode === "sex_linked_cin") {
      if (isMale) {
        return [
          { val: "Z+Z+", label: "Z⁺Z⁺ - ♂ Jantan Normal (Hijau/Kuning/Bond)" },
          { val: "Z+Zc", label: "Z⁺Zᶜ - ♂ Jantan Normal, Split Cinnamon" },
          { val: "ZcZc", label: "ZᶜZᶜ - ♂ Jantan Cinnamon" },
        ];
      } else {
        return [
          { val: "Z+W0", label: "Z⁺W - ♀ Betina Normal (Hijau/Kuning/Bond)" },
          { val: "ZcW0", label: "ZᶜW - ♀ Betina Cinnamon" },
        ];
      }
    } else if (mode === "mendel2_dom") {
      return [
        { val: "HHww", label: "HHww - Hijau Murni" },
        { val: "Hkww", label: "Hkww - Hijau Split Kuning" },
        { val: "HKww", label: "HKww - Bond (Bercak Hijau-Kuning)" },
        { val: "kkww", label: "kkww - Kuning Murni" },
        {
          val: "HHWw",
          label: "HHWw - Starblue / Abu-abu (Bawaan Hijau Murni)",
        },
        {
          val: "HkWw",
          label: "HkWw - Starblue / Abu-abu (Bawaan Split Kuning)",
        },
        { val: "HKWw", label: "HKWw - Bond Putih (Bawaan Bond)" },
        { val: "kkWw", label: "kkWw - Putih Dominan (Bawaan Kuning)" },
      ];
    } else if (mode === "mendel2_res") {
      return [
        { val: "HHPP", label: "HHPP - Hijau Murni (Non-Carrier)" },
        { val: "HHPp", label: "HHPp - Hijau Carrier Putih Resesif" },
        { val: "HHpp", label: "HHpp - Starblue / Abu-abu Resesif" },
        { val: "HKPP", label: "HKPP - Bond Biasa" },
        { val: "HKPp", label: "HKPp - Bond Carrier Putih Resesif" },
        { val: "HKpp", label: "HKpp - Bond Putih Resesif" },
        { val: "kkPP", label: "kkPP - Kuning Murni (Non-Carrier)" },
        { val: "kkPp", label: "kkPp - Kuning Carrier Putih Resesif" },
        { val: "kkpp", label: "kkpp - Putih Resesif Polos" },
      ];
    }
  };

  const handleModeChange = (mode) => {
    setCrossMode(mode);
    setF1Data(null);
    setF2Data(null);
    if (mode === "mendel1_base") {
      setP1Input("HH");
      setP2Input("kk");
    } else if (mode === "sex_linked_cin") {
      setP1Input("Z+Z+");
      setP2Input("ZcW0");
    } else if (mode === "mendel2_dom") {
      setP1Input("HkWw");
      setP2Input("HKww");
    } else if (mode === "mendel2_res") {
      setP1Input("HHPp");
      setP2Input("HKpp");
    }
  };

  // --- Kamus Fenotipe dengan Penambahan Genetik Dasar ---
  const getPhenotype = (genotype) => {
    let result = {
      label: "Unknown",
      badge: "",
      color1: "#ccc",
      color2: "#ccc",
      desc: "",
      genetics: "",
      isLethal: false,
    };

    if (
      genotype.includes("Z+") ||
      genotype.includes("Zc") ||
      genotype.includes("W0")
    ) {
      if (genotype === "Z+Z+")
        result = {
          label: "♂ Jantan Normal",
          badge: "♂ Normal",
          color1: "#2f5233",
          color2: "#4a7c59",
          desc: "Melanin penuh (Hijau/Kuning/Bond).",
          genetics: "Bawaan Asli: Normal (Z⁺Z⁺)",
        };
      if (genotype === "Z+Zc" || genotype === "ZcZ+")
        result = {
          label: "♂ Jantan Split Cinnamon",
          badge: "♂ Split Cin",
          color1: "#4a7c59",
          color2: "#8b5a2b",
          desc: "Visual normal, bawa gen Cinnamon.",
          genetics: "Bawaan Asli: Carrier Cinnamon (Z⁺Zᶜ)",
        };
      if (genotype === "ZcZc")
        result = {
          label: "♂ Jantan Cinnamon",
          badge: "♂ Cinnamon",
          color1: "#8b5a2b",
          color2: "#6b4226",
          desc: "Melanin coklat.",
          genetics: "Bawaan Asli: Mutasi Cinnamon Penuh (ZᶜZᶜ)",
        };
      if (genotype === "Z+W0" || genotype === "W0Z+")
        result = {
          label: "♀ Betina Normal",
          badge: "♀ Normal",
          color1: "#2f5233",
          color2: "#4a7c59",
          desc: "Melanin penuh (Hijau/Kuning/Bond).",
          genetics: "Bawaan Asli: Normal (Z⁺W)",
        };
      if (genotype === "ZcW0" || genotype === "W0Zc")
        result = {
          label: "♀ Betina Cinnamon",
          badge: "♀ Cinnamon",
          color1: "#8b5a2b",
          color2: "#6b4226",
          desc: "Melanin coklat aktif.",
          genetics: "Bawaan Asli: Mutasi Cinnamon (ZᶜW)",
        };
      if (genotype === "W0W0")
        result = {
          label: "Super Female (Letal)",
          badge: "Lethal",
          color1: "#ccc",
          color2: "#ccc",
          desc: "Letal.",
          genetics: "Lethal Factor",
          isLethal: true,
        };
      return result;
    }

    if (genotype.length === 2) {
      if (genotype === "HH")
        result = {
          label: "Hijau Murni",
          badge: "Dominan",
          color1: "#2f5233",
          color2: "#4a7c59",
          desc: "Melanin Penuh.",
          genetics: "Bawaan Asli: Hijau Murni Dominan (HH)",
        };
      if (genotype === "Hk")
        result = {
          label: "Hijau Split Kuning",
          badge: "Carrier",
          color1: "#4a7c59",
          color2: "#84cc16",
          desc: "Carrier kuning.",
          genetics: "Bawaan Asli: Hijau + Gen Kuning Resesif (Hk)",
        };
      if (genotype === "HK")
        result = {
          label: "Bond / Pied",
          badge: "Heterozigot",
          color1: "#4a7c59",
          color2: "#facc15",
          desc: "Bercak hijau kuning.",
          genetics: "Bawaan Asli: Campuran Hijau & Kuning (HK)",
        };
      if (genotype === "kk" || genotype === "KK" || genotype === "kK")
        result = {
          label: "Kuning Murni",
          badge: "Resesif",
          color1: "#f4d35e",
          color2: "#faf0ca",
          desc: "Lipokrom murni.",
          genetics: "Bawaan Asli: Kuning Resesif Penuh (kk)",
        };
      return result;
    }

    const getBaseGenName = (base) => {
      if (base === "HH") return "Hijau Murni (HH)";
      if (base === "Hk") return "Hijau Split Kuning (Hk)";
      if (base === "HK") return "Bond / Campuran (HK)";
      return "Kuning Murni (kk)";
    };

    if (genotype.length === 4 && genotype.toLowerCase().includes("w")) {
      const baseGen = genotype.substring(0, 2);
      const whiteGen = genotype.substring(2, 4);
      const baseName = getBaseGenName(baseGen);

      if (whiteGen.includes("WW"))
        return {
          label: "Letal (Mati di Telur)",
          badge: "Lethal",
          color1: "#94a3b8",
          color2: "#e2e8f0",
          desc: "WW Letal.",
          genetics: "Lethal Factor Dominan",
          isLethal: true,
        };

      if (whiteGen.includes("Ww")) {
        let genDesc = `${baseName} + Faktor Putih Dominan (Ww)`;
        if (baseGen === "HH")
          return {
            label: "Starblue / Abu-abu",
            badge: "HHWw",
            color1: "#64748b",
            color2: "#94a3b8",
            desc: "Hijau tertutup putih.",
            genetics: genDesc,
          };
        if (baseGen === "Hk")
          return {
            label: "Starblue Carrier Kuning",
            badge: "HkWw",
            color1: "#64748b",
            color2: "#94a3b8",
            desc: "Abu-abu split kuning.",
            genetics: genDesc,
          };
        if (baseGen === "HK")
          return {
            label: "Bond Putih (Wdk)",
            badge: "HKWw",
            color1: "#ffffff",
            color2: "#64748b",
            desc: "Bercak putih dan abu-abu.",
            genetics: genDesc,
          };
        return {
          label: "Putih Dominan (Wdk)",
          badge: "kkWw",
          color1: "#ffffff",
          color2: "#fef08a",
          desc: "Visual dominan putih.",
          genetics: genDesc,
        };
      }

      let genDesc = `${baseName} + Tanpa Faktor Putih (ww)`;
      if (baseGen === "HH")
        return {
          label: "Hijau Murni",
          badge: "HHww",
          color1: "#2f5233",
          color2: "#4a7c59",
          desc: "Melanin penuh.",
          genetics: genDesc,
        };
      if (baseGen === "Hk")
        return {
          label: "Hijau Split Kuning",
          badge: "Hkww",
          color1: "#4a7c59",
          color2: "#84cc16",
          desc: "Visual hijau split kuning.",
          genetics: genDesc,
        };
      if (baseGen === "HK")
        return {
          label: "Bond / Pied",
          badge: "HKww",
          color1: "#4a7c59",
          color2: "#facc15",
          desc: "Bercak hijau kuning.",
          genetics: genDesc,
        };
      return {
        label: "Kuning Murni",
        badge: "kkww",
        color1: "#f4d35e",
        color2: "#faf0ca",
        desc: "Kuning murni.",
        genetics: genDesc,
      };
    }

    if (genotype.length === 4 && genotype.toLowerCase().includes("p")) {
      const baseGen = genotype.substring(0, 2);
      const resGen = genotype.substring(2, 4);
      const baseName = getBaseGenName(baseGen);

      if (resGen === "pp") {
        let genDesc = `${baseName} + Mutasi Putih Resesif Aktif (pp)`;
        if (baseGen === "HH")
          return {
            label: "Starblue (Abu-abu)",
            badge: "HHpp",
            color1: "#64748b",
            color2: "#94a3b8",
            desc: "Hijau hilang kuning.",
            genetics: genDesc,
          };
        if (baseGen === "HK" || baseGen === "Hk")
          return {
            label: "Bond Putih Resesif",
            badge: "Bond pp",
            color1: "#ffffff",
            color2: "#64748b",
            desc: "Bercak Abu & Putih bersih.",
            genetics: genDesc,
          };
        return {
          label: "Putih Resesif Polos",
          badge: "kkpp",
          color1: "#ffffff",
          color2: "#f8fafc",
          desc: "Putih bersih polos.",
          genetics: genDesc,
        };
      }

      if (resGen === "Pp" || resGen === "pP") {
        let genDesc = `${baseName} + Carrier Putih Resesif (Pp)`;
        if (baseGen === "HH")
          return {
            label: "Hijau Carrier Putih",
            badge: "Split Putih",
            color1: "#2f5233",
            color2: "#4a7c59",
            desc: "Hijau bawa gen putih.",
            genetics: genDesc,
          };
        if (baseGen === "HK")
          return {
            label: "Bond Carrier Putih",
            badge: "Split Putih",
            color1: "#4a7c59",
            color2: "#facc15",
            desc: "Bond bawa gen putih.",
            genetics: genDesc,
          };
        if (baseGen === "Hk")
          return {
            label: "Hijau Double Carrier",
            badge: "Split K&P",
            color1: "#4a7c59",
            color2: "#84cc16",
            desc: "Bawa kuning & putih.",
            genetics: genDesc,
          };
        return {
          label: "Kuning Carrier Putih",
          badge: "Split Putih",
          color1: "#f4d35e",
          color2: "#faf0ca",
          desc: "Kuning bawa gen putih.",
          genetics: genDesc,
        };
      }

      let genDesc = `${baseName} + Tanpa Gen Putih (PP)`;
      if (baseGen === "HH")
        return {
          label: "Hijau Murni",
          badge: "HHPP",
          color1: "#2f5233",
          color2: "#4a7c59",
          desc: "Melanin penuh.",
          genetics: genDesc,
        };
      if (baseGen === "Hk")
        return {
          label: "Hijau Split Kuning",
          badge: "HkPP",
          color1: "#4a7c59",
          color2: "#84cc16",
          desc: "Visual hijau split kuning.",
          genetics: genDesc,
        };
      if (baseGen === "HK")
        return {
          label: "Bond / Pied",
          badge: "HKPP",
          color1: "#4a7c59",
          color2: "#facc15",
          desc: "Bercak hijau kuning.",
          genetics: genDesc,
        };
      return {
        label: "Kuning Murni",
        badge: "kkPP",
        color1: "#f4d35e",
        color2: "#faf0ca",
        desc: "Kuning murni.",
        genetics: genDesc,
      };
    }

    return result;
  };

  const calculatePunnett = (g1, g2, mode) => {
    let gametesP1 = [];
    let gametesP2 = [];

    const normalizeGenotype = (g) => {
      let normalized = g;
      if (
        mode === "mendel1_base" ||
        mode === "mendel2_dom" ||
        mode === "mendel2_res"
      ) {
        const arr = g.split("");
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === "K") arr[i] = "k";
        }
        normalized = arr.join("");
      }
      return normalized;
    };

    const normG1 = normalizeGenotype(g1);
    const normG2 = normalizeGenotype(g2);

    if (mode.startsWith("mendel1")) {
      gametesP1 = normG1.split("");
      gametesP2 = normG2.split("");
    } else if (mode === "sex_linked_cin") {
      gametesP1 = [normG1.substring(0, 2), normG1.substring(2, 4)];
      gametesP2 = [normG2.substring(0, 2), normG2.substring(2, 4)];
    } else {
      for (let b of normG1.substring(0, 2).split("")) {
        for (let w of normG1.substring(2, 4).split("")) {
          gametesP1.push(b + w);
        }
      }
      for (let b of normG2.substring(0, 2).split("")) {
        for (let w of normG2.substring(2, 4).split("")) {
          gametesP2.push(b + w);
        }
      }
    }

    gametesP1 = [...new Set(gametesP1)];
    gametesP2 = [...new Set(gametesP2)];

    let square = [];
    let genotypesCount = {};
    let phenotypesCount = {};
    let total = gametesP1.length * gametesP2.length;
    let lethalCount = 0;

    for (let i = 0; i < gametesP1.length; i++) {
      let row = [];
      for (let j = 0; j < gametesP2.length; j++) {
        let allele1 = gametesP1[i];
        let allele2 = gametesP2[j];

        let genotype = "";
        if (mode.startsWith("mendel1")) {
          genotype = [allele1, allele2]
            .sort((a, b) => (a === "H" || a === "W" ? -1 : 1))
            .join("");
        } else if (mode === "sex_linked_cin") {
          let alleles = [allele1, allele2].sort((a, b) => {
            if (a.includes("W")) return 1;
            if (b.includes("W")) return -1;
            if (a === "Z+" && b === "Zc") return -1;
            if (a === "Zc" && b === "Z+") return 1;
            return 0;
          });
          genotype = alleles.join("");
        } else {
          let baseTrait = [allele1[0], allele2[0]]
            .sort((a, b) => (a === "H" ? -1 : 1))
            .join("");
          let secondaryTrait = [allele1[1], allele2[1]]
            .sort((a, b) => (a === "W" || a === "P" ? -1 : 1))
            .join("");
          genotype = baseTrait + secondaryTrait;
        }

        let displayGenotype = genotype;
        if (
          mode === "mendel2_dom" ||
          mode === "mendel2_res" ||
          mode === "mendel1_base"
        ) {
          if (displayGenotype.substring(0, 2) === "Hk") {
            displayGenotype = "HK" + displayGenotype.substring(2);
          }
        }

        row.push(displayGenotype);
        genotypesCount[displayGenotype] =
          (genotypesCount[displayGenotype] || 0) + 1;

        let pheno = getPhenotype(displayGenotype);
        if (pheno.isLethal) lethalCount++;

        let phenoLabel = pheno.label;
        phenotypesCount[phenoLabel] = (phenotypesCount[phenoLabel] || 0) + 1;
      }
      square.push(row);
    }

    const genoRatios = Object.entries(genotypesCount)
      .map(([g, c]) => ({
        genotype: g,
        count: c,
        percentage: ((c / total) * 100).toFixed(0),
      }))
      .sort((a, b) => b.count - a.count);
    const phenoRatios = Object.entries(phenotypesCount)
      .map(([p, c]) => ({
        phenotype: p,
        count: c,
        percentage: ((c / total) * 100).toFixed(0),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      gametesP1,
      gametesP2,
      square,
      genoRatios,
      phenoRatios,
      total,
      lethalCount,
    };
  };

  const handleSilangkanF1 = () => {
    const result = calculatePunnett(p1Input, p2Input, crossMode);
    setF1Data(result);
    setF2Data(null);

    let validMales = result.genoRatios.filter(
      (g) => !g.genotype.includes("WW"),
    );
    let validFemales = result.genoRatios.filter(
      (g) => !g.genotype.includes("WW"),
    );

    if (crossMode === "sex_linked_cin") {
      validMales = validMales.filter((g) => !g.genotype.includes("W0"));
      validFemales = validFemales.filter((g) => g.genotype.includes("W0"));
    }

    if (validMales.length > 0) setF2Parent1(validMales[0].genotype);
    if (validFemales.length > 0) setF2Parent2(validFemales[0].genotype);

    setTimeout(() => {
      f1Ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSilangkanF2 = () => {
    const result = calculatePunnett(f2Parent1, f2Parent2, crossMode);
    setF2Data(result);
    setTimeout(() => {
      f2Ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // --- Visual Components moved outside render ---

  const renderPunnettBoard = (data, title) => {
    if (!data) return null;

    const isF2 = title.includes("F2");
    const bgHeader = isF2 ? "bg-slate-800" : "bg-teal-700";
    const textHighlight = isF2 ? "text-slate-600" : "text-teal-600";

    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6 md:mt-8 font-sans">
        <div
          className={`${bgHeader} rounded-xl p-4 md:p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-700/50 backdrop-blur-sm`}
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-teal-300" /> Analisis Hasil:{" "}
              {title}
            </h2>
          </div>
          <div className="bg-black/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/10 flex items-center gap-2 w-full md:w-auto">
            <Dna size={16} />
            <span className="text-xs md:text-sm font-semibold">
              Sampel: {data.total} Kombinasi
            </span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200 p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} /> Matriks Persilangan
            </h3>
            {crossMode.includes("mendel2") && (
              <span className="text-[10px] md:text-xs bg-teal-100/80 text-teal-800 px-2 md:px-3 py-1 rounded font-bold">
                Dihybrid Active
              </span>
            )}
          </div>
          <div className="overflow-x-auto p-2 md:p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    className={`p-2 md:p-3 border border-slate-200 bg-slate-100/50 text-slate-500 font-semibold w-16 md:w-24 rounded-tl-lg text-xs md:text-sm`}
                  >
                    Gamet
                  </th>
                  {data.gametesP2.map((g2, i) => (
                    <th
                      key={i}
                      className={`p-2 md:p-4 border-t border-r border-slate-200 bg-pink-50/40 text-pink-700 font-bold text-base md:text-xl`}
                    >
                      <span className="text-[9px] md:text-[10px] text-pink-400 block mb-0.5 md:mb-1">
                        ♀ Betina
                      </span>
                      {g2
                        .replace("Z+", "Z⁺")
                        .replace("Zc", "Zᶜ")
                        .replace("W0", "W")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.gametesP1.map((g1, i) => (
                  <tr key={i}>
                    <td
                      className={`p-2 md:p-4 border border-slate-200 bg-blue-50/40 text-blue-700 font-bold text-center text-base md:text-xl`}
                    >
                      <span className="text-[9px] md:text-[10px] text-blue-400 block mb-0.5 md:mb-1">
                        ♂ Jantan
                      </span>
                      {g1.replace("Z+", "Z⁺").replace("Zc", "Zᶜ")}
                    </td>
                    {data.square[i].map((genotype, j) => {
                      const pheno = getPhenotype(genotype);
                      const displayGeno = genotype
                        .replace(/Z\+/g, "Z⁺")
                        .replace(/Zc/g, "Zᶜ")
                        .replace(/W0/g, "W");
                      return (
                        <td
                          key={j}
                          className={`p-2 md:p-4 border border-slate-200 text-center relative group transition-all duration-200 ${pheno.isLethal ? "bg-slate-100/50" : "hover:bg-slate-50/80"}`}
                        >
                          <div
                            className={`font-mono text-base md:text-xl font-bold mb-1.5 md:mb-3 tracking-widest ${pheno.isLethal ? "text-slate-400 line-through" : "text-slate-800"}`}
                          >
                            {displayGeno}
                          </div>
                          <div className="flex justify-center mb-1.5 md:mb-3">
                            <ColorSwatch
                              color1={pheno.color1}
                              color2={pheno.color2}
                              isLethal={pheno.isLethal}
                            />
                          </div>
                          <div
                            className={`text-[9px] md:text-[11px] font-bold leading-tight px-0.5 md:px-1 ${pheno.isLethal ? "text-slate-500" : "text-slate-700"}`}
                          >
                            {pheno.label}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="bg-slate-50/80 border-b border-slate-200 p-3 md:p-4 rounded-t-xl">
              <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">
                Probabilitas Genotipe (DNA)
              </h3>
            </div>
            <div className="p-3 md:p-4 flex-1">
              <ul className="space-y-2 md:space-y-3">
                {data.genoRatios.map((item, idx) => {
                  const isLethal = item.genotype.includes("WW");
                  const displayGeno = item.genotype
                    .replace(/Z\+/g, "Z⁺")
                    .replace(/Zc/g, "Zᶜ")
                    .replace(/W0/g, "W");
                  return (
                    <li
                      key={idx}
                      className={`flex justify-between items-center p-2 md:p-3 rounded-lg border ${isLethal ? "bg-slate-50/50 border-slate-200" : "bg-white/50 border-slate-100 shadow-sm"}`}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span
                          className={`font-mono font-bold text-xs md:text-sm px-2 md:px-3 py-1 rounded border ${isLethal ? "bg-slate-200 text-slate-500 border-slate-300" : "bg-slate-100 text-slate-800 border-slate-200"}`}
                        >
                          {displayGeno}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span
                            className={`font-bold text-lg md:text-xl ${isLethal ? "text-slate-400" : textHighlight}`}
                          >
                            {item.count}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-slate-400">
                            /{data.total}
                          </span>
                        </div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-400">
                          {item.percentage}%
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="bg-slate-50/80 border-b border-slate-200 p-3 md:p-4 rounded-t-xl">
              <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">
                Estimasi Fenotipe Visual
              </h3>
            </div>
            <div className="p-3 md:p-4 flex-1">
              <ul className="space-y-2 md:space-y-3">
                {data.phenoRatios.map((item, idx) => {
                  const isLethal = item.phenotype.includes("Letal");
                  const sampleGeno = data.square
                    .flat()
                    .find((g) => getPhenotype(g).label === item.phenotype);
                  const pheno = getPhenotype(sampleGeno);
                  return (
                    <li
                      key={idx}
                      className={`flex justify-between items-center p-2 md:p-3 rounded-lg border ${isLethal ? "bg-slate-50/50 border-slate-200" : "bg-white/50 border-slate-100 shadow-sm"}`}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <ColorSwatch
                          color1={pheno.color1}
                          color2={pheno.color2}
                          isLethal={isLethal}
                        />
                        <div>
                          <div
                            className={`font-bold text-xs md:text-sm leading-tight ${isLethal ? "text-slate-500" : "text-slate-800"}`}
                          >
                            {item.phenotype}
                          </div>
                          <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 leading-snug">
                            <span className="font-semibold text-slate-600">
                              Gen Dasar:
                            </span>{" "}
                            {pheno.genetics.replace("Bawaan Asli: ", "")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span
                            className={`font-bold text-lg md:text-xl ${isLethal ? "text-slate-400" : textHighlight}`}
                          >
                            {item.count}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-slate-400">
                            /{data.total}
                          </span>
                        </div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-400">
                          {item.percentage}%
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {data.lethalCount > 0 && (
          <div className="flex items-start gap-2 md:gap-3 bg-slate-100/90 backdrop-blur-md border-l-4 border-slate-400 p-3 md:p-4 rounded-r-lg mt-4 md:mt-6">
            <AlertTriangle
              className="text-slate-500 flex-shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-700">
                Peringatan Gen Letal
              </h4>
              <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-relaxed">
                Persilangan ini menghasilkan genotipe letal dominan homozigot
                (WW). Embrio akan mengalami kematian dini di dalam cangkang
                (Dead in Shell).
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen text-slate-800 p-3 md:p-6 font-sans pb-32 bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(241, 245, 249, 0.9), rgba(241, 245, 249, 0.95)), url('https://images.unsplash.com/photo-1552727451-6fde190a6e35?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      <div className="max-w-[1400px] w-full mx-auto space-y-4 md:space-y-6 relative z-10">
        <header className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-teal-600 text-white rounded-xl shadow-inner">
              <Bird size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">
                Avigen <span className="text-teal-600 font-light">Pro</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">
                Canary Genetics Prediction Software v7.0
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200/50 p-3 md:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-4">
            <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
              <Settings2 size={16} /> Konfigurasi Indukan
            </h2>

            <div className="flex flex-wrap bg-white/80 border border-slate-200/50 p-1 rounded-lg w-full xl:w-auto text-[10px] md:text-xs font-semibold shadow-sm">
              <button
                onClick={() => handleModeChange("mendel1_base")}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-all ${crossMode === "mendel1_base" ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Mendel 1 (Segregasi)
              </button>
              <button
                onClick={() => handleModeChange("sex_linked_cin")}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-all ${crossMode === "sex_linked_cin" ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Sex-Linked (Taut Seks)
              </button>
              <button
                onClick={() => handleModeChange("mendel2_dom")}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-all ${crossMode === "mendel2_dom" ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Dihibrid (P. Dominan)
              </button>
              <button
                onClick={() => handleModeChange("mendel2_res")}
                className={`flex-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-all ${crossMode === "mendel2_res" ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Dihibrid (P. Resesif)
              </button>
            </div>
          </div>

          <div className="p-3 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
              <div className="lg:col-span-5 relative border-2 border-blue-100/50 bg-blue-50/20 rounded-xl p-3 md:p-4 mt-3 lg:mt-0 flex flex-col justify-between">
                <div className="absolute -top-3 left-3 md:left-4 bg-white border border-blue-200 text-blue-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <span>♂</span> Jantan{" "}
                  {crossMode === "sex_linked_cin" && "- ZZ"}
                </div>
                <div className="mt-1">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 md:mb-1.5">
                    Pilih Profil Genetik
                  </label>
                  <div className="relative">
                    <select
                      value={p1Input}
                      onChange={(e) => setP1Input(e.target.value)}
                      className="w-full p-2 md:p-2.5 pl-2 md:pl-3 pr-6 md:pr-8 border border-slate-300/80 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white/90 shadow-sm"
                    >
                      {getDropdownOptions(crossMode, true).map((opt) => (
                        <option key={opt.val} value={opt.val}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 md:right-3 top-2.5 md:top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
                {(() => {
                  const pheno = getPhenotype(p1Input);
                  return (
                    <div className="mt-3 bg-white/80 backdrop-blur p-3 rounded-lg border border-blue-200/50 flex items-center gap-3 shadow-sm">
                      <MiniColorSwatch
                        color1={pheno.color1}
                        color2={pheno.color2}
                        isLethal={pheno.isLethal}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] md:text-xs font-bold text-blue-900 leading-tight">
                          {pheno.label}
                        </div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 leading-snug mt-1">
                          <span className="font-bold text-blue-700">
                            Genetik Dasar:
                          </span>{" "}
                          {pheno.genetics.replace("Bawaan Asli: ", "")}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="lg:col-span-5 relative border-2 border-pink-100/50 bg-pink-50/20 rounded-xl p-3 md:p-4 mt-3 lg:mt-0 flex flex-col justify-between">
                <div className="absolute -top-3 left-3 md:left-4 bg-white border border-pink-200 text-pink-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <span>♀</span> Betina{" "}
                  {crossMode === "sex_linked_cin" && "- ZW"}
                </div>
                <div className="mt-1">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 md:mb-1.5">
                    Pilih Profil Genetik
                  </label>
                  <div className="relative">
                    <select
                      value={p2Input}
                      onChange={(e) => setP2Input(e.target.value)}
                      className="w-full p-2 md:p-2.5 pl-2 md:pl-3 pr-6 md:pr-8 border border-slate-300/80 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white/90 shadow-sm"
                    >
                      {getDropdownOptions(crossMode, false).map((opt) => (
                        <option key={opt.val} value={opt.val}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 md:right-3 top-2.5 md:top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
                {(() => {
                  const pheno = getPhenotype(p2Input);
                  return (
                    <div className="mt-3 bg-white/80 backdrop-blur p-3 rounded-lg border border-pink-200/50 flex items-center gap-3 shadow-sm">
                      <MiniColorSwatch
                        color1={pheno.color1}
                        color2={pheno.color2}
                        isLethal={pheno.isLethal}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] md:text-xs font-bold text-pink-900 leading-tight">
                          {pheno.label}
                        </div>
                        <div className="text-[9px] md:text-[10px] text-slate-500 leading-snug mt-1">
                          <span className="font-bold text-pink-700">
                            Genetik Dasar:
                          </span>{" "}
                          {pheno.genetics.replace("Bawaan Asli: ", "")}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="lg:col-span-2 mt-3 md:mt-4 lg:mt-0 flex flex-col justify-end">
                <button
                  onClick={handleSilangkanF1}
                  className="w-full h-[60px] md:h-full lg:min-h-[104px] bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm xl:text-base backdrop-blur-sm"
                >
                  <Activity size={16} className="md:w-5 md:h-5" /> SIMULASI F1
                </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={f1Ref}>
          {renderPunnettBoard(f1Data, "Generasi Pertama (F1)")}
        </div>

        {f1Data && (
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 mt-4 md:mt-6 animate-in fade-in duration-700 overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-200/50 p-3 md:p-4">
              <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <GitBranch size={16} /> Modul Inbreeding (Generasi F2)
              </h2>
            </div>

            <div className="p-3 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
                <div className="lg:col-span-5 relative mt-1 lg:mt-0 flex flex-col justify-between">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 md:mb-1.5">
                    ♂ Anakan Jantan F1
                  </label>
                  <div className="relative">
                    <select
                      value={f2Parent1}
                      onChange={(e) => setF2Parent1(e.target.value)}
                      className="w-full p-2 md:p-2.5 pl-2 md:pl-3 pr-6 md:pr-8 border border-slate-300/80 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-slate-500 appearance-none bg-slate-50/90"
                    >
                      {f1Data.genoRatios
                        .filter((g) => !g.genotype.includes("WW"))
                        .filter(
                          (g) =>
                            crossMode !== "sex_linked_cin" ||
                            !g.genotype.includes("W0"),
                        )
                        .map((opt) => {
                          const display = opt.genotype
                            .replace(/Z\+/g, "Z⁺")
                            .replace(/Zc/g, "Zᶜ")
                            .replace(/W0/g, "W");
                          return (
                            <option key={opt.genotype} value={opt.genotype}>
                              {display} - {getPhenotype(opt.genotype).label}
                            </option>
                          );
                        })}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 md:right-3 top-2.5 md:top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                  {f2Parent1 &&
                    (() => {
                      const pheno = getPhenotype(f2Parent1);
                      return (
                        <div className="mt-3 bg-white/80 backdrop-blur p-3 rounded-lg border border-slate-200/50 flex items-center gap-3 shadow-sm">
                          <MiniColorSwatch
                            color1={pheno.color1}
                            color2={pheno.color2}
                            isLethal={pheno.isLethal}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] md:text-xs font-bold text-slate-800 leading-tight">
                              {pheno.label}
                            </div>
                            <div className="text-[9px] md:text-[10px] text-slate-500 leading-snug mt-1">
                              <span className="font-bold text-slate-600">
                                Genetik Dasar:
                              </span>{" "}
                              {pheno.genetics.replace("Bawaan Asli: ", "")}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="lg:col-span-5 relative mt-2 md:mt-3 lg:mt-0 flex flex-col justify-between">
                  <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 md:mb-1.5">
                    ♀ Anakan Betina F1
                  </label>
                  <div className="relative">
                    <select
                      value={f2Parent2}
                      onChange={(e) => setF2Parent2(e.target.value)}
                      className="w-full p-2 md:p-2.5 pl-2 md:pl-3 pr-6 md:pr-8 border border-slate-300/80 rounded-lg text-xs md:text-sm font-medium text-slate-700 focus:ring-2 focus:ring-slate-500 appearance-none bg-slate-50/90"
                    >
                      {f1Data.genoRatios
                        .filter((g) => !g.genotype.includes("WW"))
                        .filter(
                          (g) =>
                            crossMode !== "sex_linked_cin" ||
                            g.genotype.includes("W0"),
                        )
                        .map((opt) => {
                          const display = opt.genotype
                            .replace(/Z\+/g, "Z⁺")
                            .replace(/Zc/g, "Zᶜ")
                            .replace(/W0/g, "W");
                          return (
                            <option key={opt.genotype} value={opt.genotype}>
                              {display} - {getPhenotype(opt.genotype).label}
                            </option>
                          );
                        })}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 md:right-3 top-2.5 md:top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                  {f2Parent2 &&
                    (() => {
                      const pheno = getPhenotype(f2Parent2);
                      return (
                        <div className="mt-3 bg-white/80 backdrop-blur p-3 rounded-lg border border-slate-200/50 flex items-center gap-3 shadow-sm">
                          <MiniColorSwatch
                            color1={pheno.color1}
                            color2={pheno.color2}
                            isLethal={pheno.isLethal}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] md:text-xs font-bold text-slate-800 leading-tight">
                              {pheno.label}
                            </div>
                            <div className="text-[9px] md:text-[10px] text-slate-500 leading-snug mt-1">
                              <span className="font-bold text-slate-600">
                                Genetik Dasar:
                              </span>{" "}
                              {pheno.genetics.replace("Bawaan Asli: ", "")}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="lg:col-span-2 mt-3 md:mt-4 lg:mt-0 flex flex-col justify-end">
                  <button
                    onClick={handleSilangkanF2}
                    className="w-full h-[60px] md:h-full lg:min-h-[104px] bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm xl:text-base backdrop-blur-sm"
                  >
                    <GitBranch size={16} /> SIMULASI F2
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={f2Ref}>
          {renderPunnettBoard(f2Data, "Generasi Kedua (F2)")}
        </div>
      </div>
    </div>
  );
}
