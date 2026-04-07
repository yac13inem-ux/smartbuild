/**
 * Progress Calculation Utilities
 * 
 * Calculation Rules:
 * - Unit Global Progress = (Gros Œuvre × 50%) + (CES × 30%) + (CET × 20%)
 * - Block Global Progress = Average of all units' global progress + Gros Œuvre floors contribution
 * - Project Global Progress = Average of all blocks' global progress
 */

export interface UnitProgress {
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  cesPlumbing?: number;
  cesElectrical?: number;
  cesPainting?: number;
  cesFlooring?: number;
  cesCarpentry?: number;
  cesCeramic?: number;
  cetHvac?: number;
  cetFireFighting?: number;
  cetElevators?: number;
  cetPlumbing?: number;
  cetElectrical?: number;
}

export interface FloorProgress {
  ironApproval: boolean;
  concretePoured: boolean;
}

export interface BlockProgress {
  grosOeuvreProgress: number;
  cesProgress: number;
  cetProgress: number;
  totalFloors?: number;
  units?: { globalProgress: number }[];
  grosOeuvreFloors?: FloorProgress[];
}

export interface ProjectProgress {
  blocks?: { globalProgress: number }[];
}

/**
 * Calculate Unit's CES progress from its sub-items
 * CES = Average of 6 sub-items (Plumbing, Electrical, Painting, Flooring, Carpentry, Ceramic)
 */
export function calculateCESProgress(unit: UnitProgress): number {
  const subItems = [
    unit.cesPlumbing ?? 0,
    unit.cesElectrical ?? 0,
    unit.cesPainting ?? 0,
    unit.cesFlooring ?? 0,
    unit.cesCarpentry ?? 0,
    unit.cesCeramic ?? 0,
  ];

  return Math.round(subItems.reduce((sum, val) => sum + val, 0) / subItems.length);
}

/**
 * Calculate Unit's CET progress from its sub-items
 * CET = Average of 5 sub-items (HVAC, Fire Fighting, Elevators, Plumbing, Electrical)
 */
export function calculateCETProgress(unit: UnitProgress): number {
  const subItems = [
    unit.cetHvac ?? 0,
    unit.cetFireFighting ?? 0,
    unit.cetElevators ?? 0,
    unit.cetPlumbing ?? 0,
    unit.cetElectrical ?? 0,
  ];

  return Math.round(subItems.reduce((sum, val) => sum + val, 0) / subItems.length);
}

/**
 * Calculate Unit's Global Progress
 * Global = (Gros Œuvre × 50%) + (CES × 30%) + (CET × 20%)
 */
export function calculateUnitGlobalProgress(unit: UnitProgress): number {
  const cesProgress = calculateCESProgress(unit);
  const cetProgress = calculateCETProgress(unit);

  const globalProgress =
    (unit.grosOeuvreProgress * 0.5) +
    (cesProgress * 0.3) +
    (cetProgress * 0.2);

  return Math.round(globalProgress);
}

/**
 * Calculate Block's Gros Œuvre progress from floors
 * Gros Œuvre = (Floors with iron approval / Total floors) × 50% + (Floors poured / Total floors) × 50%
 */
export function calculateBlockGrosOeuvreFromFloors(
  floors: FloorProgress[],
  totalFloors: number
): number {
  if (totalFloors === 0 || floors.length === 0) {
    return 0;
  }

  const ironApprovalCount = floors.filter(f => f.ironApproval).length;
  const pouredCount = floors.filter(f => f.concretePoured).length;

  const ironProgress = (ironApprovalCount / totalFloors) * 50;
  const pourProgress = (pouredCount / totalFloors) * 50;

  return Math.round(ironProgress + pourProgress);
}

/**
 * Calculate Block's Global Progress
 * If there are units, use the average of units' global progress
 * Otherwise, calculate from Gros Œuvre floors
 */
export function calculateBlockGlobalProgress(block: BlockProgress): number {
  // If there are units, calculate based on units
  if (block.units && block.units.length > 0) {
    const unitsSum = block.units.reduce((sum, unit) => sum + unit.globalProgress, 0);
    return Math.round(unitsSum / block.units.length);
  }

  // Otherwise, calculate from Gros Œuvre floors
  if (block.grosOeuvreFloors && block.totalFloors) {
    const grosOeuvreFromFloors = calculateBlockGrosOeuvreFromFloors(
      block.grosOeuvreFloors,
      block.totalFloors
    );
    return grosOeuvreFromFloors;
  }

  // Fallback to the manually set grosOeuvreProgress
  return block.grosOeuvreProgress;
}

/**
 * Calculate Project's Global Progress
 * Global = Average of all blocks' global progress
 */
export function calculateProjectGlobalProgress(project: ProjectProgress): number {
  if (!project.blocks || project.blocks.length === 0) {
    return 0;
  }

  const blocksSum = project.blocks.reduce((sum, block) => sum + block.globalProgress, 0);
  return Math.round(blocksSum / project.blocks.length);
}

/**
 * Recalculate and update all progress values for a unit
 */
export function recalculateUnitProgress(unit: UnitProgress) {
  return {
    cesProgress: calculateCESProgress(unit),
    cetProgress: calculateCETProgress(unit),
    globalProgress: calculateUnitGlobalProgress(unit),
  };
}
