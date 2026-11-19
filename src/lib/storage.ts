import { UseCase, GateId, GateStatus } from "@/types";
import { INITIAL_USE_CASES } from "./mockData";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const STORAGE_KEY = "opella_ai_use_cases_v1";

export async function fetchUseCases(): Promise<UseCase[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("opella_use_cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          ...row.data,
          id: row.id,
          updatedAt: row.updated_at,
        }));
      } else if (!error && data && data.length === 0) {
        // Table exists in Supabase but is brand new/empty: auto-seed default Opella use cases
        try {
          const rowsToInsert = INITIAL_USE_CASES.map((uc) => ({
            id: uc.id,
            title: uc.title,
            tier: uc.tier,
            mode: uc.mode,
            risk_tier: uc.riskTier,
            current_gate: uc.currentGate,
            status: uc.status,
            data: uc,
            updated_at: uc.updatedAt,
          }));
          await supabase.from("opella_use_cases").insert(rowsToInsert);
          return INITIAL_USE_CASES;
        } catch (seedErr) {
          console.warn("Could not auto-seed Supabase:", seedErr);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch error, falling back to local storage:", err);
    }
  }

  // Fallback to localStorage in browser
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USE_CASES));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  return INITIAL_USE_CASES;
}

export async function saveUseCase(useCase: UseCase): Promise<UseCase> {
  const updatedCase = {
    ...useCase,
    updatedAt: new Date().toISOString(),
  };

  // 1. Supabase persistence
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("opella_use_cases").upsert({
        id: updatedCase.id,
        title: updatedCase.title,
        tier: updatedCase.tier,
        mode: updatedCase.mode,
        risk_tier: updatedCase.riskTier,
        current_gate: updatedCase.currentGate,
        status: updatedCase.status,
        data: updatedCase,
        updated_at: updatedCase.updatedAt,
      });
    } catch (err) {
      console.error("Supabase upsert failed:", err);
    }
  }

  // 2. localStorage persistence
  if (typeof window !== "undefined") {
    try {
      const existing = await fetchUseCases();
      const index = existing.findIndex((item) => item.id === updatedCase.id);
      let nextList: UseCase[];
      if (index >= 0) {
        nextList = [...existing];
        nextList[index] = updatedCase;
      } else {
        nextList = [updatedCase, ...existing];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  }

  return updatedCase;
}

export async function updateGateStatus(
  useCaseId: string,
  gateId: GateId,
  newStatus: GateStatus,
  feedback?: string
): Promise<UseCase | null> {
  const list = await fetchUseCases();
  const target = list.find((item) => item.id === useCaseId);
  if (!target) return null;

  const updatedGates = { ...target.gates };
  if (updatedGates[gateId]) {
    updatedGates[gateId] = {
      ...updatedGates[gateId],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      feedback: feedback || updatedGates[gateId].feedback,
    };
  }

  // Compute current gate and overall status progression
  const gateOrder: GateId[] = ["G1", "G2", "G3", "G4", "G5", "G6"];
  const currentIdx = gateOrder.indexOf(gateId);

  let newOverallStatus = target.status;
  let nextActiveGate = target.currentGate;

  if (newStatus === "PASSED") {
    if (gateId === "G4") {
      newOverallStatus = "BUILD_MVP";
      nextActiveGate = "G5";
      if (updatedGates.G5 && updatedGates.G5.status === "PENDING") {
        updatedGates.G5.status = "IN_REVIEW";
      }
    } else if (gateId === "G5") {
      newOverallStatus = "SCALED";
      nextActiveGate = "G6";
      if (updatedGates.G6 && updatedGates.G6.status === "PENDING") {
        updatedGates.G6.status = "IN_REVIEW";
      }
    } else if (gateId === "G6") {
      newOverallStatus = "RUN";
    } else if (currentIdx < gateOrder.length - 1) {
      const nextG = gateOrder[currentIdx + 1];
      nextActiveGate = nextG;
      if (updatedGates[nextG] && updatedGates[nextG].status === "PENDING") {
        updatedGates[nextG].status = "IN_REVIEW";
      }
    }
  } else if (newStatus === "FAILED") {
    newOverallStatus = "PAUSED";
  }

  const updatedCase: UseCase = {
    ...target,
    gates: updatedGates,
    currentGate: nextActiveGate,
    status: newOverallStatus,
  };

  return await saveUseCase(updatedCase);
}

export async function deleteUseCase(id: string): Promise<boolean> {
  // 1. Supabase deletion
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("opella_use_cases").delete().eq("id", id);
      if (error) {
        console.warn("Supabase delete returned error:", error);
      }
    } catch (err) {
      console.error("Supabase delete failed:", err);
    }
  }

  // 2. localStorage persistence
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const list: UseCase[] = JSON.parse(stored);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error("Local storage delete error:", e);
    }
  }

  return true;
}

export async function resetToDefaults(): Promise<UseCase[]> {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USE_CASES));
  }
  return INITIAL_USE_CASES;
}
