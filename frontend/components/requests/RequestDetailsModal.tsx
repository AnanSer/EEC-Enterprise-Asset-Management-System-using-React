'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  PackageCheck,
  User,
  Building2,
  Calendar,
  ExternalLink,
  Tag,
  FileText,
  Mail,
  ShieldAlert,
  ArrowRight,
  Info,
  Check,
  AlertTriangle,
  Ban,
  Package,
} from 'lucide-react';
import { AssetRequest } from '@/constants/requests';
import { ASSET_CATEGORY_LABELS, ASSET_CONDITION_LABELS } from '@/constants/assets';
import RequestStatusBadge from './RequestStatusBadge';

interface RequestDetailsModalProps {
  request: AssetRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (req: AssetRequest) => void;
  onReject?: (req: AssetRequest) => void;
  onFulfill?: (req: AssetRequest) => void;
  canApproveOrReject?: boolean;
  canFulfill?: boolean;
}

export default function RequestDetailsModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onFulfill,
  canApproveOrReject = false,
  canFulfill = false,
}: RequestDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !request) return null;

  const requesterName = request.requester
    ? `${request.requester.firstName} ${request.requester.lastName}`
    : 'Unknown Requester';
  const requesterEmail =
    request.requester?.user?.email || (request.requester as any)?.email || null;

  const approverName = request.approvedBy?.employeeProfile
    ? `${request.approvedBy.employeeProfile.firstName} ${request.approvedBy.employeeProfile.lastName}`
    : request.approvedBy?.email || 'Admin';

  const rejectorName = request.rejectedBy?.employeeProfile
    ? `${request.rejectedBy.employeeProfile.firstName} ${request.rejectedBy.employeeProfile.lastName}`
    : request.rejectedBy?.email || 'Admin';

  const fulfillerName = request.fulfilledBy?.employeeProfile
    ? `${request.fulfilledBy.employeeProfile.firstName} ${request.fulfilledBy.employeeProfile.lastName}`
    : request.fulfilledBy?.email || 'Store Keeper';

  const categoryLabel = ASSET_CATEGORY_LABELS[request.category] || request.category;

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-eec-primary/10 text-eec-primary shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-slate-800 text-sm sm:text-base">
                  {request.requestNumber}
                </span>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="text-2xs sm:text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                Submitted on {formatDateTime(request.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          {/* Top Quick Details Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Requester Profile Card */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> Requester Profile
                </span>
                <span className="font-mono text-3xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                  {request.requester.employeeId}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{requesterName}</p>
                {request.requester.jobTitle && (
                  <p className="text-2xs text-slate-500 font-medium">{request.requester.jobTitle}</p>
                )}
                {requesterEmail && (
                  <p className="text-2xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    {requesterEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Department & Allocation Info */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <span className="text-3xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> Target Department
              </span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{request.department?.name || 'General'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-slate-200/60 text-slate-600">
                    CODE: {request.department?.code || 'N/A'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-3xs font-bold bg-eec-primary/10 text-eec-primary">
                    {categoryLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Specification & Justification */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Business Justification
              </span>
              <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Equipment Category: {categoryLabel}
              </span>
            </div>
            <div>
              <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
            {request.notes && (
              <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-2xs text-slate-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-800">Additional Requester Notes:</span>
                  <p className="text-amber-900 mt-0.5">{request.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Lifecycle Journey Flow */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Request Journey Flow
            </span>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Submission */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-white">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <div className="ml-1">
                  <p className="text-xs font-bold text-slate-800">Request Submitted</p>
                  <p className="text-2xs text-slate-500">
                    By {requesterName} on {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>

              {/* Step 2: Administrative Review */}
              <div className="relative">
                {request.status === 'PENDING' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-4 ring-white animate-pulse">
                      <Clock className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-amber-800">Pending Review</p>
                      <p className="text-2xs text-slate-500">
                        Awaiting Administrative approval or review.
                      </p>
                    </div>
                  </>
                ) : request.status === 'REJECTED' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 ring-4 ring-white">
                      <X className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-rose-800">Request Rejected</p>
                      <p className="text-2xs text-slate-500">
                        By {rejectorName} on {formatDateTime(request.rejectedAt)}
                      </p>
                      {request.rejectionReason && (
                        <div className="mt-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-2xs">
                          <span className="font-semibold">Reason:</span> {request.rejectionReason}
                        </div>
                      )}
                    </div>
                  </>
                ) : request.status === 'CANCELLED' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 ring-4 ring-white">
                      <Ban className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-slate-700">Request Cancelled</p>
                      <p className="text-2xs text-slate-500">Cancelled by the requester.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-4 ring-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-blue-800">Approved for Handover</p>
                      <p className="text-2xs text-slate-500">
                        By {approverName} on {formatDateTime(request.approvedAt)}
                      </p>
                      {request.approvalRemarks && (
                        <div className="mt-1.5 p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-2xs italic">
                          "{request.approvalRemarks}"
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Step 3: Store Handover & Fulfillment */}
              <div className="relative">
                {request.status === 'FULFILLED' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-white">
                      <PackageCheck className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-emerald-800">Physical Handover Fulfilled</p>
                      <p className="text-2xs text-slate-500">
                        By {fulfillerName} on {formatDateTime(request.fulfilledAt)}
                      </p>
                      {request.handoverNotes && (
                        <p className="mt-1 text-2xs text-slate-500 italic">
                          Handover Notes: {request.handoverNotes}
                        </p>
                      )}
                    </div>
                  </>
                ) : request.status === 'APPROVED' ? (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-4 ring-white animate-pulse">
                      <Clock className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div className="ml-1">
                      <p className="text-xs font-bold text-amber-800">Awaiting Store Handover</p>
                      <p className="text-2xs text-slate-500">
                        Store Keeper is ready to allocate an inventory unit and complete physical handover.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-400 ring-4 ring-white">
                      <Package className="w-3 h-3" />
                    </span>
                    <div className="ml-1 opacity-60">
                      <p className="text-xs font-semibold text-slate-500">Inventory Allocation</p>
                      <p className="text-2xs text-slate-400">
                        Requires approval before unit assignment.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Asset Details (When Fulfilled) */}
          {request.status === 'FULFILLED' && request.asset && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" /> Assigned Asset Unit
                </span>
                <Link
                  href={`/assets/${request.asset.id}`}
                  className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>View Asset Record</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-3xs text-emerald-600 font-semibold block uppercase">Asset Tag / Code</span>
                  <Link
                    href={`/assets/${request.asset.id}`}
                    className="font-mono font-bold text-xs sm:text-sm text-emerald-900 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    {request.asset.assetCode}
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </Link>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{request.asset.name}</p>
                </div>
                <div className="space-y-1.5 text-2xs">
                  <div>
                    <span className="text-slate-400">Category: </span>
                    <span className="font-semibold text-slate-700">
                      {ASSET_CATEGORY_LABELS[request.asset.category] || request.asset.category}
                    </span>
                  </div>
                  {request.asset.serialNumber && (
                    <div>
                      <span className="text-slate-400">Serial #: </span>
                      <span className="font-mono text-slate-700">{request.asset.serialNumber}</span>
                    </div>
                  )}
                  {request.asset.condition && (
                    <div>
                      <span className="text-slate-400">Condition: </span>
                      <span className="font-medium text-slate-700">
                        {ASSET_CONDITION_LABELS[request.asset.condition] || request.asset.condition}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {/* Admin Actions: Approve / Reject when PENDING */}
            {request.status === 'PENDING' && canApproveOrReject && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReject?.(request);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onApprove?.(request);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white bg-eec-primary hover:bg-eec-primary/90 text-xs font-bold shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Request</span>
                </button>
              </>
            )}

            {/* Store Keeper Actions: Fulfill when APPROVED */}
            {request.status === 'APPROVED' && canFulfill && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFulfill?.(request);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 text-xs font-bold shadow-xs transition-colors"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Fulfill Handover</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
