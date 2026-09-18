import {
  UserProfile,
  UnitKerja,
  StandardSNP,
  IndikatorMutu,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  AuditLogItem
} from '@/types/tpmps';

export interface AppDatabaseState {
  users: UserProfile[];
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  indikatorList: IndikatorMutu[];
  evaluasiList: EvaluasiMutu[];
  dokumenList: BuktiDokumen[];
  programRtlList: ProgramMutuRTL[];
  auditLogs: AuditLogItem[];
}

/**
 * Resolve full relational details for an evaluation record
 */
export function getEvaluasiRelations(evalId: string, state: AppDatabaseState) {
  const evaluation = state.evaluasiList.find((e) => e.id === evalId);
  if (!evaluation) return null;

  const indicator = state.indikatorList.find((i) => i.id === evaluation.indikatorId);
  const standard = state.standarSnpList.find((s) => s.id === evaluation.standardId);
  const unit = state.unitKerjaList.find((u) => u.id === evaluation.unitId);
  const reviewer = state.users.find((u) => u.id === evaluation.reviewerId);
  const documents = state.dokumenList.filter((d) => d.evaluasiId === evaluation.id);
  const programs = state.programRtlList.filter((p) => p.evaluasiId === evaluation.id);

  return {
    ...evaluation,
    indicator,
    standard,
    unit,
    reviewer,
    documents,
    programs
  };
}

/**
 * Resolve full relational details for a unit kerja
 */
export function getUnitRelations(unitId: string, state: AppDatabaseState) {
  const unit = state.unitKerjaList.find((u) => u.id === unitId);
  if (!unit) return null;

  const picUser = state.users.find((u) => u.id === unit.picUserId);
  const staffUsers = state.users.filter((u) => u.unitId === unit.id);
  const evaluations = state.evaluasiList.filter((e) => e.unitId === unit.id);
  const documents = state.dokumenList.filter((d) => d.unitId === unit.id);
  const programs = state.programRtlList.filter((p) => p.unitId === unit.id);

  return {
    ...unit,
    picUser,
    staffUsers,
    evaluations,
    documents,
    programs
  };
}

/**
 * Resolve full relational details for an RTL program
 */
export function getRtlRelations(rtlId: string, state: AppDatabaseState) {
  const program = state.programRtlList.find((p) => p.id === rtlId);
  if (!program) return null;

  const originEvaluation = state.evaluasiList.find((e) => e.id === program.evaluasiId);
  const indicator = state.indikatorList.find((i) => i.id === program.indikatorId);
  const standard = state.standarSnpList.find((s) => s.id === program.standardId);
  const unit = state.unitKerjaList.find((u) => u.id === program.unitId);
  const picUser = state.users.find((u) => u.id === program.picUserId);

  return {
    ...program,
    originEvaluation,
    indicator,
    standard,
    unit,
    picUser
  };
}

/**
 * Resolve full relational details for a document
 */
export function getDokumenRelations(docId: string, state: AppDatabaseState) {
  const document = state.dokumenList.find((d) => d.id === docId);
  if (!document) return null;

  const linkedEvaluation = state.evaluasiList.find((e) => e.id === document.evaluasiId);
  const indicator = state.indikatorList.find((i) => i.id === document.indikatorId);
  const standard = state.standarSnpList.find((s) => s.id === document.standardId);
  const unit = state.unitKerjaList.find((u) => u.id === document.unitId);
  const uploader = state.users.find((u) => u.id === document.uploadedByUserId);
  const verifier = state.users.find((u) => u.id === document.verifiedByUserId);

  return {
    ...document,
    linkedEvaluation,
    indicator,
    standard,
    unit,
    uploader,
    verifier
  };
}
