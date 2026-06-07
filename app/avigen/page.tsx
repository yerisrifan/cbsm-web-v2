// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Settings2,
  Dna,
  GitBranch,
  AlertTriangle,
  ChevronDown,
  Activity,
  EggOff,
  Info,
} from "lucide-react";

export default function App() {
  const [crossMode, setCrossMode] = useState("mendel1_base");

  // Input State P1 (Sire) & P2 (Dam)
  const [p1Input, setP1Input] = useState("HH");
  const [p2Input, setP2Input] = useState("kk");

  // List of simulated generations
  const [crosses, setCrosses] = useState([]);

  // Next Gen Form State
  const [nextSireSource, setNextSireSource] = useState("C1");
  const [nextSireGenotype, setNextSireGenotype] = useState("");
  const [nextDamSource, setNextDamSource] = useState("C1");
  const [nextDamGenotype, setNextDamGenotype] = useState("");

  const latestCrossRef = useRef(null);

  // --- Opsi Dropdown Berdasarkan Mode ---
  const getDropdownOptions = (mode, isMale) => {
    if (mode === "ab_x_ab") {
      return [
        { val: "AABB", label: "AABB - Dominan A & B" },
        { val: "AABb", label: "AABb - Dominan A, Carrier b" },
        { val: "AAbb", label: "AAbb - Dominan A, Resesif b" },
        { val: "AaBB", label: "AaBB - Carrier a, Dominan B" },
        { val: "AaBb", label: "AaBb - Double Carrier" },
        { val: "Aabb", label: "Aabb - Carrier a, Resesif b" },
        { val: "aaBB", label: "aaBB - Resesif a, Dominan B" },
        { val: "aaBb", label: "aaBb - Resesif a, Carrier b" },
        { val: "aabb", label: "aabb - Double Resesif" },
      ];
    } else if (mode === "mendel1_base") {
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
        { val: "HHWw", label: "HHWw - Starblue (Bawaan Hijau Murni)" },
        { val: "HkWw", label: "HkWw - Starblue (Bawaan Split Kuning)" },
        { val: "HKWw", label: "HKWw - Bond Putih (Bawaan Bond)" },
        { val: "kkWw", label: "kkWw - Putih Dominan (Bawaan Kuning)" },
      ];
    } else if (mode === "mendel2_res") {
      return [
        { val: "HHPP", label: "HHPP - Hijau Murni" },
        { val: "HHPp", label: "HHPp - Hijau Carrier Putih Resesif" },
        { val: "HHpp", label: "HHpp - Starblue Resesif" },
        { val: "HKPP", label: "HKPP - Bond Biasa" },
        { val: "HKPp", label: "HKPp - Bond Carrier Putih Resesif" },
        { val: "HKpp", label: "HKpp - Bond Putih Resesif" },
        { val: "kkPP", label: "kkPP - Kuning Murni" },
        { val: "kkPp", label: "kkPp - Kuning Carrier Putih Resesif" },
        { val: "kkpp", label: "kkpp - Putih Resesif Polos" },
      ];
    }
  };

  const handleModeChange = (mode) => {
    setCrossMode(mode);
    setCrosses([]);
    if (mode === "ab_x_ab") {
      setP1Input("AABB");
      setP2Input("aabb");
    } else if (mode === "mendel1_base") {
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

  // --- Kamus Fenotipe ---
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

    // Mode abxab
    if (genotype.length === 4 && genotype.match(/^[AaBb]+$/)) {
      let countA = (genotype.match(/A/g) || []).length;
      let countB = (genotype.match(/B/g) || []).length;

      let phenoA = countA > 0 ? "Dominan A" : "Resesif a";
      let phenoB = countB > 0 ? "Dominan B" : "Resesif b";

      let color1 = countA > 0 ? "#1d4ed8" : "#93c5fd";
      let color2 = countB > 0 ? "#b91c1c" : "#fca5a5";

      let label = `${phenoA} & ${phenoB}`;
      let genetics = `Sifat: ${countA > 0 ? (countA === 2 ? "Homozigot A" : "Heterozigot A") : "Homozigot a"} & ${countB > 0 ? (countB === 2 ? "Homozigot B" : "Heterozigot B") : "Homozigot b"}`;

      return {
        label,
        badge: `${phenoA[0]}-${phenoB[0]}`,
        color1,
        color2,
        desc: genetics,
        genetics,
        isLethal: false,
      };
    }

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
          genetics: "Normal (Z⁺Z⁺)",
        };
      if (genotype === "Z+Zc" || genotype === "ZcZ+")
        result = {
          label: "♂ Jantan Split Cin",
          badge: "♂ Split Cin",
          color1: "#4a7c59",
          color2: "#8b5a2b",
          genetics: "Carrier Cinnamon (Z⁺Zᶜ)",
        };
      if (genotype === "ZcZc")
        result = {
          label: "♂ Jantan Cinnamon",
          badge: "♂ Cinnamon",
          color1: "#8b5a2b",
          color2: "#6b4226",
          genetics: "Cinnamon Penuh (ZᶜZᶜ)",
        };
      if (genotype === "Z+W0" || genotype === "W0Z+")
        result = {
          label: "♀ Betina Normal",
          badge: "♀ Normal",
          color1: "#2f5233",
          color2: "#4a7c59",
          genetics: "Normal (Z⁺W)",
        };
      if (genotype === "ZcW0" || genotype === "W0Zc")
        result = {
          label: "♀ Betina Cinnamon",
          badge: "♀ Cinnamon",
          color1: "#8b5a2b",
          color2: "#6b4226",
          genetics: "Cinnamon (ZᶜW)",
        };
      if (genotype === "W0W0")
        result = {
          label: "Super Female (Letal)",
          badge: "Lethal",
          color1: "#ccc",
          color2: "#ccc",
          genetics: "Lethal Factor",
          isLethal: true,
        };
      return result;
    }

    if (genotype.length === 2) {
      if (genotype === "HH")
        result = {
          label: "Hijau Murni",
          color1: "#2f5233",
          color2: "#4a7c59",
          genetics: "Dominan (HH)",
        };
      if (genotype === "Hk")
        result = {
          label: "Hijau Split Kuning",
          color1: "#4a7c59",
          color2: "#84cc16",
          genetics: "Carrier (Hk)",
        };
      if (genotype === "HK")
        result = {
          label: "Bond / Pied",
          color1: "#4a7c59",
          color2: "#facc15",
          genetics: "Bercak (HK)",
        };
      if (genotype === "kk" || genotype === "KK" || genotype === "kK")
        result = {
          label: "Kuning Murni",
          color1: "#f4d35e",
          color2: "#faf0ca",
          genetics: "Resesif (kk)",
        };
      return result;
    }

    if (genotype.length === 4 && genotype.toLowerCase().includes("w")) {
      const baseGen = genotype.substring(0, 2);
      const whiteGen = genotype.substring(2, 4);
      if (whiteGen.includes("WW"))
        return {
          label: "Letal (Mati di Telur)",
          color1: "#94a3b8",
          color2: "#e2e8f0",
          genetics: "Lethal Dominan",
          isLethal: true,
        };

      if (whiteGen.includes("Ww")) {
        if (baseGen === "HH")
          return {
            label: "Starblue / Abu-abu",
            color1: "#64748b",
            color2: "#94a3b8",
            genetics: "Faktor Putih Dominan",
          };
        if (baseGen === "Hk")
          return {
            label: "Starblue Carrier Kuning",
            color1: "#64748b",
            color2: "#94a3b8",
            genetics: "Faktor Putih Dominan",
          };
        if (baseGen === "HK")
          return {
            label: "Bond Putih (Wdk)",
            color1: "#ffffff",
            color2: "#64748b",
            genetics: "Faktor Putih Dominan",
          };
        return {
          label: "Putih Dominan",
          color1: "#ffffff",
          color2: "#fef08a",
          genetics: "Faktor Putih Dominan",
        };
      }

      if (baseGen === "HH")
        return {
          label: "Hijau Murni",
          color1: "#2f5233",
          color2: "#4a7c59",
          genetics: "Melanin Penuh",
        };
      if (baseGen === "Hk")
        return {
          label: "Hijau Split Kuning",
          color1: "#4a7c59",
          color2: "#84cc16",
          genetics: "Carrier Kuning",
        };
      if (baseGen === "HK")
        return {
          label: "Bond / Pied",
          color1: "#4a7c59",
          color2: "#facc15",
          genetics: "Bercak",
        };
      return {
        label: "Kuning Murni",
        color1: "#f4d35e",
        color2: "#faf0ca",
        genetics: "Resesif Penuh",
      };
    }

    if (genotype.length === 4 && genotype.toLowerCase().includes("p")) {
      const baseGen = genotype.substring(0, 2);
      const resGen = genotype.substring(2, 4);

      if (resGen === "pp") {
        if (baseGen === "HH")
          return {
            label: "Starblue (Abu-abu)",
            color1: "#64748b",
            color2: "#94a3b8",
            genetics: "Resesif Aktif",
          };
        if (baseGen === "HK" || baseGen === "Hk")
          return {
            label: "Bond Putih Resesif",
            color1: "#ffffff",
            color2: "#64748b",
            genetics: "Resesif Aktif",
          };
        return {
          label: "Putih Resesif Polos",
          color1: "#ffffff",
          color2: "#f8fafc",
          genetics: "Resesif Aktif",
        };
      }

      if (resGen === "Pp" || resGen === "pP") {
        if (baseGen === "HH")
          return {
            label: "Hijau Carrier Putih",
            color1: "#2f5233",
            color2: "#4a7c59",
            genetics: "Carrier Putih",
          };
        if (baseGen === "HK")
          return {
            label: "Bond Carrier Putih",
            color1: "#4a7c59",
            color2: "#facc15",
            genetics: "Carrier Putih",
          };
        if (baseGen === "Hk")
          return {
            label: "Hijau Double Carrier",
            color1: "#4a7c59",
            color2: "#84cc16",
            genetics: "Carrier Putih & Kuning",
          };
        return {
          label: "Kuning Carrier Putih",
          color1: "#f4d35e",
          color2: "#faf0ca",
          genetics: "Carrier Putih",
        };
      }

      if (baseGen === "HH")
        return {
          label: "Hijau Murni",
          color1: "#2f5233",
          color2: "#4a7c59",
          genetics: "Tanpa Gen Putih",
        };
      if (baseGen === "Hk")
        return {
          label: "Hijau Split Kuning",
          color1: "#4a7c59",
          color2: "#84cc16",
          genetics: "Tanpa Gen Putih",
        };
      if (baseGen === "HK")
        return {
          label: "Bond / Pied",
          color1: "#4a7c59",
          color2: "#facc15",
          genetics: "Tanpa Gen Putih",
        };
      return {
        label: "Kuning Murni",
        color1: "#f4d35e",
        color2: "#faf0ca",
        genetics: "Tanpa Gen Putih",
      };
    }

    return result;
  };

  const calculatePunnett = (g1, g2, mode) => {
    let gametesP1 = [];
    let gametesP2 = [];

    const normalizeGenotype = (g) => {
      let normalized = g;
      if (mode === "ab_x_ab") return normalized;
      if (mode.includes("mendel")) {
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

    if (mode === "mendel1_base") {
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
        if (mode === "mendel1_base") {
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
        } else if (mode === "ab_x_ab") {
          let baseTrait = [allele1[0], allele2[0]]
            .sort((a, b) => (a === a.toUpperCase() ? -1 : 1))
            .join("");
          let secondaryTrait = [allele1[1], allele2[1]]
            .sort((a, b) => (a === a.toUpperCase() ? -1 : 1))
            .join("");
          genotype = baseTrait + secondaryTrait;
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
          if (displayGenotype.substring(0, 2) === "Hk")
            displayGenotype = "HK" + displayGenotype.substring(2);
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

  // --- Algoritma Pedigree & Koefisien Inbreeding ---
  const buildPedigreeGraph = (currentCrosses) => {
    let graph = {};
    let addInd = (id, sireId, damId, depth) => {
      graph[id] = { id, sireId, damId, depth, F: 0 };
      return graph[id];
    };

    let memo = {};
    const getKinship = (idA, idB) => {
      if (!idA || !idB) return 0;
      if (idA === idB) return 0.5 * (1 + graph[idA].F);

      let key = idA < idB ? `${idA}_${idB}` : `${idB}_${idA}`;
      if (memo[key] !== undefined) return memo[key];

      let indA = graph[idA];
      let indB = graph[idB];
      let res = 0;

      if (
        indA.depth > indB.depth ||
        (indA.depth === indB.depth && indA.id > indB.id)
      ) {
        res =
          0.5 * getKinship(indA.sireId, idB) +
          0.5 * getKinship(indA.damId, idB);
      } else {
        res =
          0.5 * getKinship(idA, indB.sireId) +
          0.5 * getKinship(idA, indB.damId);
      }
      memo[key] = res;
      return res;
    };

    addInd("P1", null, null, 0);
    addInd("P2", null, null, 0);

    currentCrosses.forEach((cross) => {
      if (cross.sireSource.startsWith("OC_") && !graph[cross.sireSource])
        addInd(cross.sireSource, null, null, 0);
      if (cross.damSource.startsWith("OC_") && !graph[cross.damSource])
        addInd(cross.damSource, null, null, 0);

      let sNodeId = cross.sireSource;
      let dNodeId = cross.damSource;

      if (cross.sireSource.startsWith("C")) {
        let pCross = currentCrosses.find((c) => c.id === cross.sireSource);
        sNodeId = `Sire_for_${cross.id}`;
        let depth =
          Math.max(
            graph[pCross.sireNodeId].depth,
            graph[pCross.damNodeId].depth,
          ) + 1;
        addInd(sNodeId, pCross.sireNodeId, pCross.damNodeId, depth);
        graph[sNodeId].F = getKinship(pCross.sireNodeId, pCross.damNodeId);
      }

      if (cross.damSource.startsWith("C")) {
        let pCross = currentCrosses.find((c) => c.id === cross.damSource);
        dNodeId = `Dam_for_${cross.id}`;
        let depth =
          Math.max(
            graph[pCross.sireNodeId].depth,
            graph[pCross.damNodeId].depth,
          ) + 1;
        addInd(dNodeId, pCross.sireNodeId, pCross.damNodeId, depth);
        graph[dNodeId].F = getKinship(pCross.sireNodeId, pCross.damNodeId);
      }

      cross.sireNodeId = sNodeId;
      cross.damNodeId = dNodeId;

      cross.F = getKinship(sNodeId, dNodeId);
    });

    return { graph, getKinship };
  };

  // --- Algoritma Serapan Darah (Bloodline) ---
  const getFounderBloodline = (sourceId, allCrosses) => {
    if (sourceId === "P1") return { P1: 100 };
    if (sourceId === "P2") return { P2: 100 };
    if (sourceId.startsWith("OC_")) return { [sourceId]: 100 };
    if (sourceId.startsWith("C")) {
      let pCross = allCrosses.find((c) => c.id === sourceId);
      return pCross ? pCross.bloodline : {};
    }
    return {};
  };

  const calculateBloodline = (sireSrc, damSrc, allCrosses) => {
    let sB = getFounderBloodline(sireSrc, allCrosses);
    let dB = getFounderBloodline(damSrc, allCrosses);
    let cB = {};
    let keys = new Set([...Object.keys(sB), ...Object.keys(dB)]);
    keys.forEach((k) => {
      cB[k] = ((sB[k] || 0) + (dB[k] || 0)) / 2;
    });
    return cB;
  };

  const getAvailableGenotypes = (source, isMale) => {
    if (source === "P1") return [{ val: p1Input, label: p1Input }];
    if (source === "P2") return [{ val: p2Input, label: p2Input }];
    if (source === "OC") return getDropdownOptions(crossMode, isMale);

    const cross = crosses.find((c) => c.id === source);
    if (!cross) return [];

    let options = cross.data.genoRatios.map((g) => ({
      val: g.genotype,
      label: g.genotype + " - " + getPhenotype(g.genotype).label,
    }));
    options = options.filter((o) => !getPhenotype(o.val).isLethal);

    if (crossMode === "sex_linked_cin") {
      if (isMale) options = options.filter((o) => !o.val.includes("W0"));
      else options = options.filter((o) => o.val.includes("W0"));
    }
    return options;
  };

  useEffect(() => {
    if (crosses.length === 0) return;
    const sOpts = getAvailableGenotypes(nextSireSource, true);
    if (sOpts.length > 0 && !sOpts.find((o) => o.val === nextSireGenotype))
      setNextSireGenotype(sOpts[0].val);

    const dOpts = getAvailableGenotypes(nextDamSource, false);
    if (dOpts.length > 0 && !dOpts.find((o) => o.val === nextDamGenotype))
      setNextDamGenotype(dOpts[0].val);
  }, [nextSireSource, nextDamSource, crosses, crossMode]);

  const handleSimulateFirst = () => {
    const initialCross = {
      id: "C1",
      title: "Generasi Pertama (F1)",
      sireSource: "P1",
      damSource: "P2",
      sireGenotype: p1Input,
      damGenotype: p2Input,
    };

    initialCross.data = calculatePunnett(p1Input, p2Input, crossMode);

    const { graph } = buildPedigreeGraph([initialCross]);
    initialCross.F = initialCross.F || 0;
    initialCross.bloodline = calculateBloodline("P1", "P2", []);

    setCrosses([initialCross]);
    setNextSireSource("C1");
    setNextDamSource("C1");

    setTimeout(() => {
      latestCrossRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSimulateNext = () => {
    let actualSireSource = nextSireSource;
    let actualDamSource = nextDamSource;

    if (actualSireSource === "OC") actualSireSource = `OC_${Date.now()}_S`;
    if (actualDamSource === "OC") actualDamSource = `OC_${Date.now()}_D`;

    const newCrossId = `C${crosses.length + 1}`;
    let title = `Generasi ${crosses.length + 1}`;
    if (
      nextSireSource.startsWith("C") &&
      nextDamSource.startsWith("C") &&
      nextSireSource === nextDamSource
    )
      title = `Inbreeding F${crosses.length + 1}`;
    else if (nextSireSource === "P1" || nextDamSource === "P2")
      title = `Backcross BC`;
    else if (nextSireSource === "OC" || nextDamSource === "OC")
      title = `Outcross OC`;

    const newCross = {
      id: newCrossId,
      title: title,
      sireSource: actualSireSource,
      damSource: actualDamSource,
      sireGenotype: nextSireGenotype,
      damGenotype: nextDamGenotype,
    };

    const tempCrosses = [...crosses, newCross];

    const { graph } = buildPedigreeGraph(tempCrosses);
    newCross.F = newCross.F || 0;
    newCross.data = calculatePunnett(
      nextSireGenotype,
      nextDamGenotype,
      crossMode,
    );
    newCross.bloodline = calculateBloodline(
      actualSireSource,
      actualDamSource,
      crosses,
    );

    setCrosses(tempCrosses);
    setNextSireSource(newCrossId);
    setNextDamSource(newCrossId);

    setTimeout(() => {
      latestCrossRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getSourceLabel = (src) => {
    if (src === "P1") return "Jantan Awal (P1)";
    if (src === "P2") return "Betina Awal (P2)";
    if (src === "OC") return "Outcross Baru (OC)";
    if (src.startsWith("C")) return `Anakan ${src}`;
    if (src.startsWith("OC_")) return `Outcross Baru`;
    return src;
  };

  // --- Visual Components ---
  const ColorSwatch = ({ color1, color2, isLethal }) => (
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

  const MiniColorSwatch = ({ color1, color2, isLethal }) => (
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

  const renderPunnettBoard = (crossObj, idx) => {
    if (!crossObj || !crossObj.data) return null;
    const data = crossObj.data;

    const isF1 = idx === 0;
    const bgHeader = isF1 ? "bg-teal-700" : "bg-slate-800";
    const textHighlight = isF1 ? "text-teal-600" : "text-slate-600";
    const fPercentage = (crossObj.F * 100).toFixed(2);

    return (
      <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6 md:mt-8 font-sans">
        <div
          className={`${bgHeader} rounded-xl p-4 md:p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-700/50 backdrop-blur-sm`}
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              {isF1 ? (
                <Activity size={20} className="text-teal-300" />
              ) : (
                <GitBranch size={20} className="text-blue-300" />
              )}
              Hasil: {crossObj.title} ({crossObj.id})
            </h2>
            <div className="text-xs text-white/80 mt-1.5 flex flex-col gap-1.5 font-medium">
              <div className="flex items-center gap-1">
                Jantan:{" "}
                <span className="font-bold text-blue-200">
                  {getSourceLabel(crossObj.sireSource)}
                </span>{" "}
                × Betina:{" "}
                <span className="font-bold text-pink-200">
                  {getSourceLabel(crossObj.damSource)}
                </span>
              </div>
              {/* Visualisasi Serapan Darah / Bloodline */}
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider mr-1">
                  Darah:
                </span>
                {Object.entries(crossObj.bloodline).map(([f, pct]) => {
                  if (pct === 0) return null;
                  let label = f;
                  if (f === "P1") label = "P1 (♂ Awal)";
                  else if (f === "P2") label = "P2 (♀ Awal)";
                  else if (f.startsWith("OC_")) label = "OC (Outcross)";

                  return (
                    <span
                      key={f}
                      className="bg-white/20 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold text-white border border-white/10 shadow-sm"
                    >
                      {label} {pct % 1 === 0 ? pct : pct.toFixed(1)}%
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto">
            {crossObj.F > 0 && (
              <div className="bg-orange-500/90 text-white px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 text-xs md:text-sm font-bold shadow-sm">
                <AlertTriangle size={14} /> Inbreeding: {fPercentage}%
              </div>
            )}
            <div className="bg-black/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/10 flex items-center gap-2">
              <Dna size={16} />
              <span className="text-xs md:text-sm font-semibold">
                {data.total} Kombinasi
              </span>
            </div>
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
                {data.genoRatios.map((item, idxx) => {
                  const isLethal = item.genotype.includes("WW");
                  const displayGeno = item.genotype
                    .replace(/Z\+/g, "Z⁺")
                    .replace(/Zc/g, "Zᶜ")
                    .replace(/W0/g, "W");
                  return (
                    <li
                      key={idxx}
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
                {data.phenoRatios.map((item, idxx) => {
                  const isLethal = item.phenotype.includes("Letal");
                  const sampleGeno = data.square
                    .flat()
                    .find((g) => getPhenotype(g).label === item.phenotype);
                  const pheno = getPhenotype(sampleGeno);
                  return (
                    <li
                      key={idxx}
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
                Persilangan ini menghasilkan genotipe letal dominan homozigot.
                Embrio akan mengalami kematian dini.
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
            {/* Ikon DNA Diubah Menjadi Abu-abu Sesuai Permintaan */}
            <div className="p-2 md:p-3 bg-slate-100 border border-slate-200 rounded-xl shadow-inner">
              <Dna size={24} strokeWidth={2} className="text-slate-500" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">
                Avigen Pro{" "}
                <span className="text-teal-600 font-light">By CBSM</span>
              </h1>
            </div>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200/50 p-3 md:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 md:gap-4">
            <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
              <Settings2 size={16} /> Konfigurasi Jantan & Betina Awal (P1 & P2)
            </h2>

            {/* Navigasi Tab Fit Screen & Disusun Ulang (Satu Garis Lurus) */}
            <div className="flex w-full xl:w-auto bg-white/80 border border-slate-200/50 p-1 rounded-lg shadow-sm gap-0.5 sm:gap-1 overflow-x-auto">
              <button
                onClick={() => handleModeChange("mendel1_base")}
                className={`flex-1 whitespace-nowrap px-1.5 sm:px-2 py-2 rounded-md text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${crossMode === "mendel1_base" ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                Mendel 1
              </button>
              <button
                onClick={() => handleModeChange("sex_linked_cin")}
                className={`flex-1 whitespace-nowrap px-1.5 sm:px-2 py-2 rounded-md text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${crossMode === "sex_linked_cin" ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                Sex-Linked
              </button>
              <button
                onClick={() => handleModeChange("mendel2_dom")}
                className={`flex-1 whitespace-nowrap px-1.5 sm:px-2 py-2 rounded-md text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${crossMode === "mendel2_dom" ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                Dihibrid Dom
              </button>
              <button
                onClick={() => handleModeChange("mendel2_res")}
                className={`flex-1 whitespace-nowrap px-1.5 sm:px-2 py-2 rounded-md text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${crossMode === "mendel2_res" ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                Dihibrid Res
              </button>
              <button
                onClick={() => handleModeChange("ab_x_ab")}
                className={`flex-1 whitespace-nowrap px-1.5 sm:px-2 py-2 rounded-md text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${crossMode === "ab_x_ab" ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                Gen Dasar
              </button>
            </div>
          </div>

          <div className="p-3 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
              {/* P1 Input */}
              <div className="lg:col-span-5 relative border-2 border-blue-100/50 bg-blue-50/20 rounded-xl p-3 md:p-4 mt-3 lg:mt-0 flex flex-col justify-between">
                <div className="absolute -top-3 left-3 md:left-4 bg-white border border-blue-200 text-blue-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <span>♂</span> Jantan (P1)
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

              {/* P2 Input */}
              <div className="lg:col-span-5 relative border-2 border-pink-100/50 bg-pink-50/20 rounded-xl p-3 md:p-4 mt-3 lg:mt-0 flex flex-col justify-between">
                <div className="absolute -top-3 left-3 md:left-4 bg-white border border-pink-200 text-pink-700 text-[9px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <span>♀</span> Betina (P2)
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
                  onClick={handleSimulateFirst}
                  className="w-full h-[60px] md:h-full lg:min-h-[104px] bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm xl:text-base backdrop-blur-sm"
                >
                  <Activity size={16} className="md:w-5 md:h-5" /> SIMULASI P1 x
                  P2
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Generasi Render */}
        {crosses.map((cross, idx) => (
          <div
            key={cross.id}
            ref={idx === crosses.length - 1 ? latestCrossRef : null}
          >
            {renderPunnettBoard(cross, idx)}
          </div>
        ))}

        {/* Lanjut Generasi / Inbreeding / Backcross */}
        {crosses.length > 0 && crosses.length < 6 && (
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 mt-4 md:mt-6 animate-in fade-in duration-700 overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-200/50 p-3 md:p-4 flex justify-between items-center">
              <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <GitBranch size={16} /> Lanjut Persilangan Berikutnya (Inbreeding
                / Backcross / Outcross)
              </h2>
            </div>

            <div className="p-3 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                    <label className="block text-[9px] md:text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">
                      1. Pilih Sumber Jantan ♂
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={nextSireSource}
                        onChange={(e) => setNextSireSource(e.target.value)}
                        className="w-1/3 p-2 border border-slate-300 rounded-md text-[10px] md:text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="P1">Jantan P1</option>
                        {crosses.map((c) => (
                          <option key={`S_${c.id}`} value={c.id}>
                            Anakan {c.id}
                          </option>
                        ))}
                        <option value="OC">Outcross (OC)</option>
                      </select>
                      <select
                        value={nextSireGenotype}
                        onChange={(e) => setNextSireGenotype(e.target.value)}
                        className="w-2/3 p-2 border border-slate-300 rounded-md text-[10px] md:text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        {getAvailableGenotypes(nextSireSource, true).map(
                          (opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                  {nextSireGenotype &&
                    (() => {
                      const pheno = getPhenotype(nextSireGenotype);
                      return (
                        <div className="bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                          <MiniColorSwatch
                            color1={pheno.color1}
                            color2={pheno.color2}
                            isLethal={pheno.isLethal}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight">
                              {pheno.label}
                            </div>
                            <div className="text-[9px] text-slate-500 leading-snug">
                              {pheno.genetics.replace("Bawaan Asli: ", "")}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="bg-pink-50/50 border border-pink-100 rounded-lg p-3">
                    <label className="block text-[9px] md:text-[10px] font-bold text-pink-700 uppercase tracking-wider mb-2">
                      2. Pilih Sumber Betina ♀
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={nextDamSource}
                        onChange={(e) => setNextDamSource(e.target.value)}
                        className="w-1/3 p-2 border border-slate-300 rounded-md text-[10px] md:text-xs font-semibold focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="P2">Betina P2</option>
                        {crosses.map((c) => (
                          <option key={`D_${c.id}`} value={c.id}>
                            Anakan {c.id}
                          </option>
                        ))}
                        <option value="OC">Outcross (OC)</option>
                      </select>
                      <select
                        value={nextDamGenotype}
                        onChange={(e) => setNextDamGenotype(e.target.value)}
                        className="w-2/3 p-2 border border-slate-300 rounded-md text-[10px] md:text-xs font-medium focus:ring-2 focus:ring-pink-500"
                      >
                        {getAvailableGenotypes(nextDamSource, false).map(
                          (opt) => (
                            <option key={opt.val} value={opt.val}>
                              {opt.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                  {nextDamGenotype &&
                    (() => {
                      const pheno = getPhenotype(nextDamGenotype);
                      return (
                        <div className="bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                          <MiniColorSwatch
                            color1={pheno.color1}
                            color2={pheno.color2}
                            isLethal={pheno.isLethal}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] md:text-xs font-bold text-slate-800 leading-tight">
                              {pheno.label}
                            </div>
                            <div className="text-[9px] text-slate-500 leading-snug">
                              {pheno.genetics.replace("Bawaan Asli: ", "")}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="lg:col-span-2 flex flex-col justify-end">
                  <button
                    onClick={handleSimulateNext}
                    className="w-full h-[60px] md:h-full lg:min-h-[104px] bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm xl:text-base backdrop-blur-sm"
                  >
                    <GitBranch size={16} /> SIMULASI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {crosses.length >= 6 && (
          <div className="bg-slate-800 text-white p-4 rounded-xl text-center text-sm font-semibold mt-4 shadow-lg flex items-center justify-center gap-2">
            <Info size={16} /> Batas simulasi silsilah maksimum (F6) telah
            tercapai.
          </div>
        )}
      </div>
    </div>
  );
}
