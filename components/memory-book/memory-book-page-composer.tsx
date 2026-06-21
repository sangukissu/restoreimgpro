"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  CircleAlert,
  ImageIcon,
  Loader2,
  Plus,
  Replace,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  assignAssetToMemoryBookDraft,
  createEmptyMemoryBookSpread,
} from "@/lib/memory-book/draft"
import type {
  CuratorMediaOption,
  MemoryBookAssetRecord,
  MemoryBookDocumentV1,
  MemoryBookDraftDocument,
} from "@/lib/memory-book/types"
import type { MemoryBookAssetSource } from "./family-heritage-viewer"
import {
  MemoryBookBackCoverPage,
  MemoryBookCoverPage,
  MemoryBookStaticPage,
  MemoryBookStoryPage,
  splitCoverTitle,
  type MemoryBookStoryPageData,
} from "./memory-book-page"
import {
  MobileBackCoverSurface,
  MobileCoverSurface,
  MobileNotebookFrame,
  MobileNotebookSheet,
  MobileStorySurface,
} from "./mobile-memory-book-page"

type SelectedPage = "cover" | "closing" | number
type ReplacementTarget = { pageIndex: number; slotIndex: number } | null

type Reaction = {
  id: string
  reaction: string
  display_name: string
  note: string
  created_at: string
}

export function MemoryBookPageComposer({
  draft,
  document,
  assets,
  assetSources,
  reactions,
  mediaLibrary,
  selectedSourceKeys,
  workingId,
  uploading,
  hasMoreMedia,
  loadingMoreMedia,
  onAddGalleryAsset,
  onUploadToPage,
  onLoadMoreMedia,
  onDraftChange,
  onAssetUpdate,
  onRetryAsset,
  onMediaError,
}: {
  draft: MemoryBookDraftDocument
  document: MemoryBookDocumentV1 | null
  assets: MemoryBookAssetRecord[]
  assetSources: MemoryBookAssetSource[]
  reactions: Reaction[]
  mediaLibrary: CuratorMediaOption[]
  selectedSourceKeys: Set<string>
  workingId: string | null
  uploading: boolean
  hasMoreMedia: boolean
  loadingMoreMedia: boolean
  onAddGalleryAsset: (
    option: CuratorMediaOption,
    targetSpreadId: string
  ) => Promise<boolean>
  onUploadToPage: (
    files: FileList | File[],
    targetSpreadId: string
  ) => Promise<boolean>
  onLoadMoreMedia: () => void
  onDraftChange: (draft: MemoryBookDraftDocument) => void
  onAssetUpdate: (
    asset: MemoryBookAssetRecord,
    patch: { caption?: string }
  ) => Promise<void>
  onRetryAsset: (asset: MemoryBookAssetRecord) => Promise<void>
  onMediaError: () => void
}) {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    draft.spreads.length ? 0 : "cover"
  )
  const [replacementTarget, setReplacementTarget] =
    useState<ReplacementTarget>(null)
  const [pageMediaTarget, setPageMediaTarget] = useState<string | null>(null)
  const sourceMap = useMemo(
    () => new Map(assetSources.map((source) => [source.id, source])),
    [assetSources]
  )
  const assetMap = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets]
  )
  const assignedIds = useMemo(
    () => new Set(draft.spreads.flatMap((spread) => spread.assetIds)),
    [draft.spreads]
  )
  const unusedAssets = useMemo(
    () =>
      assets
        .filter((asset) => !asset.is_hidden && !assignedIds.has(asset.id))
        .sort((a, b) => a.position - b.position),
    [assets, assignedIds]
  )
  const availableGallery = useMemo(
    () =>
      mediaLibrary.filter(
        (item) => !selectedSourceKeys.has(`${item.sourceType}:${item.id}`)
      ),
    [mediaLibrary, selectedSourceKeys]
  )

  useEffect(() => {
    if (
      typeof selectedPage === "number" &&
      selectedPage >= draft.spreads.length
    ) {
      setSelectedPage(draft.spreads.length ? draft.spreads.length - 1 : "cover")
    }
  }, [draft.spreads.length, selectedPage])

  const updateCover = (patch: Partial<MemoryBookDraftDocument["cover"]>) => {
    onDraftChange({ ...draft, cover: { ...draft.cover, ...patch } })
  }

  const updateSpread = (
    index: number,
    patch: Partial<MemoryBookDraftDocument["spreads"][number]>
  ) => {
    onDraftChange({
      ...draft,
      spreads: draft.spreads.map((spread, spreadIndex) =>
        spreadIndex === index ? { ...spread, ...patch } : spread
      ),
    })
  }

  const movePage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= draft.spreads.length) return
    const spreads = [...draft.spreads]
    ;[spreads[index], spreads[target]] = [spreads[target], spreads[index]]
    onDraftChange({ ...draft, spreads })
    setSelectedPage(target)
  }

  const removePage = (index: number) => {
    const spreads = draft.spreads.filter((_, spreadIndex) => spreadIndex !== index)
    onDraftChange({ ...draft, spreads })
    setSelectedPage(spreads.length ? Math.min(index, spreads.length - 1) : "cover")
  }

  const removeFromPage = (pageIndex: number, assetId: string) => {
    const spread = draft.spreads[pageIndex]
    updateSpread(pageIndex, {
      assetIds: spread.assetIds.filter((id) => id !== assetId),
    })
  }

  const moveAssetToPage = (assetId: string, targetPageIndex: number) => {
    const sourcePageIndex = draft.spreads.findIndex((spread) =>
      spread.assetIds.includes(assetId)
    )
    const target = draft.spreads[targetPageIndex]
    if (sourcePageIndex < 0 || !target || sourcePageIndex === targetPageIndex) {
      return
    }

    const source = draft.spreads[sourcePageIndex]
    const sourceSlot = source.assetIds.indexOf(assetId)
    const nextSourceIds = source.assetIds.filter((id) => id !== assetId)
    const nextTargetIds = [...target.assetIds]

    if (nextTargetIds.length >= 2) {
      const displacedAssetId = nextTargetIds[nextTargetIds.length - 1]
      nextTargetIds[nextTargetIds.length - 1] = assetId
      nextSourceIds.splice(
        Math.min(sourceSlot, nextSourceIds.length),
        0,
        displacedAssetId
      )
    } else {
      nextTargetIds.push(assetId)
    }

    onDraftChange({
      ...draft,
      spreads: draft.spreads.map((spread, index) => {
        if (index === sourcePageIndex) {
          return { ...spread, assetIds: nextSourceIds }
        }
        if (index === targetPageIndex) {
          return { ...spread, assetIds: nextTargetIds }
        }
        return spread
      }),
    })
    setSelectedPage(targetPageIndex)
  }

  const replaceAsset = (assetId: string) => {
    if (!replacementTarget) return
    onDraftChange({
      ...draft,
      spreads: draft.spreads.map((spread, index) => {
        const withoutReplacement = spread.assetIds.filter((id) => id !== assetId)
        if (index !== replacementTarget.pageIndex) {
          return { ...spread, assetIds: withoutReplacement }
        }
        const next = [...withoutReplacement]
        next[replacementTarget.slotIndex] = assetId
        return { ...spread, assetIds: next.filter(Boolean).slice(0, 2) }
      }),
    })
    setSelectedPage(replacementTarget.pageIndex)
    setReplacementTarget(null)
  }

  const addUnusedAsset = (assetId: string) => {
    const next = assignAssetToMemoryBookDraft(draft, assetId)
    onDraftChange(next)
    const pageIndex = next.spreads.findIndex((spread) =>
      spread.assetIds.includes(assetId)
    )
    if (pageIndex >= 0) setSelectedPage(pageIndex)
  }

  const addExistingAssetToPage = (assetId: string, spreadId: string) => {
    const target = draft.spreads.find((spread) => spread.id === spreadId)
    if (!target || target.assetIds.length >= 2) return
    onDraftChange({
      ...draft,
      spreads: draft.spreads.map((spread) => ({
        ...spread,
        assetIds:
          spread.id === spreadId
            ? [...spread.assetIds.filter((id) => id !== assetId), assetId]
            : spread.assetIds.filter((id) => id !== assetId),
      })),
    })
    setSelectedPage(
      draft.spreads.findIndex((spread) => spread.id === spreadId)
    )
    setPageMediaTarget(null)
  }

  const pageMediaTargetSpread = pageMediaTarget
    ? draft.spreads.find((spread) => spread.id === pageMediaTarget) || null
    : null
  const pageMediaSlotsRemaining = pageMediaTargetSpread
    ? 2 - pageMediaTargetSpread.assetIds.length
    : 0
  const canAddNewAsset = assets.filter((asset) => !asset.is_hidden).length < 12

  const previewProps = {
    selectedPage,
    draft,
    assetMap,
    sourceMap,
  }
  const desktopSelectedPreview = <ExactPagePreview {...previewProps} />
  const mobileSelectedPreview = <MobileExactPagePreview {...previewProps} />
  const inlineSelectedPreview = (
    <>
      <div className="md:hidden">{mobileSelectedPreview}</div>
      <div className="hidden md:block lg:hidden">
        {desktopSelectedPreview}
      </div>
    </>
  )

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,610px)_minmax(460px,1fr)]">
        <div className="order-2 space-y-4 lg:order-1">
          <ComposerCard
            title="Cover"
            subtitle="The first thing your family sees"
            selected={selectedPage === "cover"}
            onSelect={() => setSelectedPage("cover")}
          >
            {selectedPage === "cover" ? (
              <div className="space-y-5 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Book title" hint={`${draft.cover.title.length}/90`}>
                    <Input
                      value={draft.cover.title}
                      maxLength={90}
                      onChange={(event) => updateCover({ title: event.target.value })}
                    />
                  </Field>
                  <Field label="Optional cover subtitle" hint={`${draft.cover.periodLabel.length}/80`}>
                    <Input
                      value={draft.cover.periodLabel}
                      maxLength={80}
                      placeholder="Stories, memories, and traditions across generations"
                      onChange={(event) => updateCover({ periodLabel: event.target.value })}
                    />
                  </Field>
                </div>
                {inlineSelectedPreview}
              </div>
            ) : null}
          </ComposerCard>

          {draft.spreads.map((spread, index) => {
            const spreadAssets = spread.assetIds
              .map((assetId) => assetMap.get(assetId))
              .filter((asset): asset is MemoryBookAssetRecord => Boolean(asset))
            const selected = selectedPage === index

            return (
              <ComposerCard
                key={spread.id}
                title={`Page ${index + 1}`}
                subtitle={spreadAssets.length ? `${spreadAssets.length} ${spreadAssets.length === 1 ? "memory" : "memories"}` : "Empty page"}
                selected={selected}
                onSelect={() => setSelectedPage(index)}
              >
                {selected ? (
                  <div className="space-y-5 pt-4">
                    <div className="flex flex-wrap items-center gap-1 border-b border-black/8 pb-3">
                      <span className="mr-auto text-xs font-semibold text-black/45">Move this page</span>
                      <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => movePage(index, -1)}>
                        <ArrowUp className="size-4" /> Earlier
                      </Button>
                      <Button type="button" variant="ghost" size="sm" disabled={index === draft.spreads.length - 1} onClick={() => movePage(index, 1)}>
                        <ArrowDown className="size-4" /> Later
                      </Button>
                      <Button type="button" variant="ghost" size="sm" disabled={spread.assetIds.length > 0} className="text-red-600" onClick={() => removePage(index)}>
                        <Trash2 className="size-4" /> Delete empty page
                      </Button>
                    </div>

                    {spreadAssets.length ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {spreadAssets.map((asset, slotIndex) => (
                          <article key={asset.id} className="rounded-xl border border-black/8 bg-[#faf9f6] p-3">
                            <MemoryThumbnail
                              asset={asset}
                              source={sourceMap.get(asset.id)}
                              className="aspect-[4/3] w-full rounded-lg"
                              onError={onMediaError}
                            />
                            <div className="mt-3 flex items-center gap-1">
                              <p className="min-w-0 flex-1 truncate text-xs font-semibold text-black/55">{asset.original_label}</p>
                              <Button type="button" variant="ghost" size="icon" className="size-8" title="Replace memory" onClick={() => setReplacementTarget({ pageIndex: index, slotIndex })}>
                                <Replace className="size-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="icon" className="size-8" title="Move to unused memories" onClick={() => removeFromPage(index, asset.id)}>
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                            <label className="mt-2 block text-xs font-semibold text-black/55">
                              Move to page
                              <select
                                value=""
                                className="mt-1 h-9 w-full rounded-md border border-black/10 bg-white px-2 text-sm"
                                onChange={(event) => {
                                  const target = Number(event.target.value)
                                  if (Number.isInteger(target)) moveAssetToPage(asset.id, target)
                                }}
                              >
                                <option value="">Choose page…</option>
                                {draft.spreads.map((targetSpread, targetIndex) => (
                                  <option
                                    key={targetSpread.id}
                                    value={targetIndex}
                                    disabled={targetIndex === index}
                                  >
                                    Page {targetIndex + 1}
                                    {targetSpread.assetIds.length >= 2
                                      ? " (swap)"
                                      : ""}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <Field label="Photo caption" hint={`${wordCount(asset.caption)}/15 words`} compact>
                              <Input
                                key={`${asset.id}:${asset.caption}`}
                                defaultValue={asset.caption}
                                maxLength={280}
                                placeholder="A short caption"
                                onBlur={(event) => {
                                  const caption = limitWords(event.target.value, 15)
                                  if (caption !== asset.caption) void onAssetUpdate(asset, { caption })
                                }}
                              />
                            </Field>
                            {asset.status !== "ready" ? (
                              <div className="mt-3 flex items-center justify-between rounded-md bg-white px-2 py-2 text-xs text-black/55">
                                <span>{asset.status === "failed" ? "Preparation failed" : "Preparing preview…"}</span>
                                {asset.status === "failed" ? (
                                  <Button type="button" variant="ghost" size="sm" onClick={() => void onRetryAsset(asset)}>
                                    <RotateCcw className="size-3.5" /> Retry
                                  </Button>
                                ) : null}
                              </div>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-black/15 bg-[#faf9f6] px-5 py-8 text-center">
                        <ImageIcon className="mx-auto size-6 text-black/28" />
                        <p className="mt-2 text-sm font-semibold">This page is empty.</p>
                        <p className="mt-1 text-xs text-black/45">Add a memory from the unused tray below.</p>
                      </div>
                    )}

                    {spread.assetIds.length < 2 ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => setPageMediaTarget(spread.id)}
                      >
                        <Plus /> Add memory to this page
                      </Button>
                    ) : null}

                    <Field label="Page title" hint={`${spread.heading.length}/80`}>
                      <Input value={spread.heading} maxLength={80} onChange={(event) => updateSpread(index, { heading: event.target.value })} />
                    </Field>
                    <Field label="Page story" hint={`${wordCount(spread.body)}/40 words`}>
                      <Textarea
                        value={spread.body}
                        maxLength={420}
                        className="min-h-28"
                        onChange={(event) => updateSpread(index, { body: limitWords(event.target.value, 40) })}
                      />
                    </Field>
                    {inlineSelectedPreview}
                  </div>
                ) : null}
              </ComposerCard>
            )
          })}

          <Button
            type="button"
            variant="outline"
            disabled={draft.spreads.length >= 6}
            onClick={() => {
              const next = createEmptyMemoryBookSpread(draft)
              const newSpread = next.spreads.at(-1)
              onDraftChange(next)
              setSelectedPage(next.spreads.length - 1)
              if (newSpread) setPageMediaTarget(newSpread.id)
            }}
          >
            <Plus /> Add page
          </Button>

          <ComposerCard
            title="Back cover message"
            subtitle="Shown after the final page closes"
            selected={selectedPage === "closing"}
            onSelect={() => setSelectedPage("closing")}
          >
            {selectedPage === "closing" ? (
              <div className="space-y-5 pt-4">
                <Field label="Back cover message" hint={`${draft.closingMessage.length}/600`}>
                  <Textarea
                    value={draft.closingMessage}
                    maxLength={600}
                    className="min-h-28"
                    placeholder="A final message printed on the back cover..."
                    onChange={(event) => onDraftChange({ ...draft, closingMessage: event.target.value })}
                  />
                </Field>
                {inlineSelectedPreview}
              </div>
            ) : null}
          </ComposerCard>

          <UnusedMemories
            assets={unusedAssets}
            sourceMap={sourceMap}
            canAdd={draft.spreads.some((spread) => spread.assetIds.length < 2) || draft.spreads.length < 6}
            onAdd={addUnusedAsset}
            onError={onMediaError}
          />


          {reactions.length ? (
            <div className="rounded-xl border border-black/8 bg-white p-4">
              <p className="font-bold">Private reactions</p>
              <div className="mt-3 space-y-2">
                {reactions.slice(0, 6).map((reaction) => (
                  <div key={reaction.id} className="rounded-lg bg-[#f5f5f2] px-3 py-2 text-sm">
                    <p className="font-semibold">{reaction.display_name || "Someone you shared it with"} · {reaction.reaction.replace("_", " ")}</p>
                    {reaction.note ? <p className="mt-1 text-black/58">{reaction.note}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="order-1 hidden lg:order-2 lg:sticky lg:top-24 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <div><p className="text-sm font-semibold">Exact page preview</p><p className="text-xs text-black/45">The same page renderer recipients see</p></div>
            <span className="rounded-full bg-[#e9efec] px-3 py-1 text-xs font-semibold text-[#47736c]">
              {selectedPage === "cover" ? "Cover" : selectedPage === "closing" ? "Back cover" : `Page ${selectedPage + 1}`}
            </span>
          </div>
          {desktopSelectedPreview}
        </div>
      </div>

      <Dialog
        open={Boolean(pageMediaTarget)}
        onOpenChange={(open) => !open && setPageMediaTarget(null)}
      >
        <DialogContent className="max-h-[90svh] max-w-4xl overflow-y-auto">
          <DialogTitle>
            Add memory to page {pageMediaTargetSpread
              ? draft.spreads.indexOf(pageMediaTargetSpread) + 1
              : ""}
          </DialogTitle>
          <DialogDescription>
            Choose from memories already in this book, your BringBack gallery,
            or upload from this device.
          </DialogDescription>

          <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-[#47736c]/40 bg-[#f7faf8] px-5 py-6 text-sm font-semibold text-[#315d55] hover:bg-[#edf5f1]">
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Upload className="size-5" />
            )}
            Upload {pageMediaSlotsRemaining > 1 ? "photos" : "a photo"} from this device
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={pageMediaSlotsRemaining > 1}
              className="sr-only"
              disabled={
                uploading ||
                pageMediaSlotsRemaining <= 0 ||
                !canAddNewAsset
              }
              onChange={(event) => {
                if (!pageMediaTarget || !event.target.files?.length) return
                const files = Array.from(event.target.files).slice(
                  0,
                  pageMediaSlotsRemaining
                )
                void onUploadToPage(files, pageMediaTarget).then((added) => {
                  if (added) setPageMediaTarget(null)
                })
                event.target.value = ""
              }}
            />
          </label>

          {unusedAssets.length ? (
            <section className="mt-5">
              <h3 className="text-sm font-bold">Unused memories in this book</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {unusedAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className="overflow-hidden rounded-xl border border-black/8 bg-white text-left hover:border-[#47736c]"
                    onClick={() =>
                      pageMediaTarget &&
                      addExistingAssetToPage(asset.id, pageMediaTarget)
                    }
                  >
                    <MemoryThumbnail
                      asset={asset}
                      source={sourceMap.get(asset.id)}
                      className="aspect-square w-full"
                      onError={onMediaError}
                    />
                    <span className="block truncate p-2 text-xs font-semibold">
                      {asset.original_label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-5">
            <h3 className="text-sm font-bold">Your BringBack gallery</h3>
            {availableGallery.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableGallery.map((option) => {
                  const preview =
                    option.posterUrl || option.previewUrl || option.fallbackUrl
                  return (
                    <button
                      key={`${option.sourceType}:${option.id}`}
                      type="button"
                      disabled={workingId === option.id || !canAddNewAsset}
                      className="overflow-hidden rounded-xl border border-black/8 bg-white text-left hover:border-[#47736c] disabled:opacity-60"
                      onClick={() => {
                        if (!pageMediaTarget) return
                        void onAddGalleryAsset(option, pageMediaTarget).then((added) => {
                          if (added) setPageMediaTarget(null)
                        })
                      }}
                    >
                      <span className="relative block aspect-square bg-[#eee9df]">
                        {preview ? (
                          <img
                            src={preview}
                            alt={option.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            onError={onMediaError}
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-black/30">
                            <Loader2 className="size-5 animate-spin" />
                          </span>
                        )}
                        {workingId === option.id ? (
                          <span className="absolute inset-0 grid place-items-center bg-white/70">
                            <Loader2 className="size-5 animate-spin" />
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate p-2 text-xs font-semibold">
                        {option.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 rounded-lg bg-[#f5f5f2] p-4 text-sm text-black/50">
                No additional gallery memories are available on this page.
              </p>
            )}
            {hasMoreMedia ? (
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                disabled={loadingMoreMedia}
                onClick={onLoadMoreMedia}
              >
                {loadingMoreMedia ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Load more gallery memories
              </Button>
            ) : null}
          </section>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(replacementTarget)} onOpenChange={(open) => !open && setReplacementTarget(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Replace this memory</DialogTitle>
          <DialogDescription>The current memory returns to the unused tray.</DialogDescription>
          {unusedAssets.length ? (
            <div className="grid max-h-[65svh] grid-cols-2 gap-3 overflow-auto sm:grid-cols-3 md:grid-cols-4">
              {unusedAssets.map((asset) => (
                <button key={asset.id} type="button" className="overflow-hidden rounded-xl border border-black/8 bg-white text-left" onClick={() => replaceAsset(asset.id)}>
                  <MemoryThumbnail asset={asset} source={sourceMap.get(asset.id)} className="aspect-square w-full" onError={onMediaError} />
                  <span className="block truncate p-2 text-xs font-semibold">{asset.original_label}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-[#f5f5f2] p-5 text-sm text-black/55">There are no unused memories. Add another memory first.</p>
          )}
        </DialogContent>
      </Dialog>

    </section>
  )
}

function MobileExactPagePreview({
  selectedPage,
  draft,
  assetMap,
  sourceMap,
}: {
  selectedPage: SelectedPage
  draft: MemoryBookDraftDocument
  assetMap: Map<string, MemoryBookAssetRecord>
  sourceMap: Map<string, MemoryBookAssetSource>
}) {
  let variant: "cover" | "story" | "back-cover" = "story"
  let surface: React.ReactNode

  if (selectedPage === "cover") {
    variant = "cover"
    surface = (
      <MobileCoverSurface
        titleLines={splitCoverTitle(draft.cover.title)}
        periodLines={
          draft.cover.periodLabel.trim() ? [draft.cover.periodLabel.trim()] : []
        }
      />
    )
  } else if (selectedPage === "closing") {
    variant = "back-cover"
    surface = <MobileBackCoverSurface message={draft.closingMessage} />
  } else {
    const spread = draft.spreads[selectedPage]
    if (!spread) return null
    surface = (
      <MobileStorySurface
        page={buildPreviewStoryPage(spread, assetMap)}
        sourceMap={sourceMap}
        textureId={`composer-mobile-${spread.id}`}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[430px] py-2">
      <MobileNotebookFrame compact>
        <MobileNotebookSheet variant={variant} compact>
          {surface}
        </MobileNotebookSheet>
      </MobileNotebookFrame>
    </div>
  )
}
function ExactPagePreview({ selectedPage, draft, assetMap, sourceMap }: {
  selectedPage: SelectedPage
  draft: MemoryBookDraftDocument
  assetMap: Map<string, MemoryBookAssetRecord>
  sourceMap: Map<string, MemoryBookAssetSource>
}) {
  if (selectedPage === "cover") {
    return <MemoryBookStaticPage><MemoryBookCoverPage title={draft.cover.title} periodLabel={draft.cover.periodLabel} /></MemoryBookStaticPage>
  }
  if (selectedPage === "closing") {
    return <MemoryBookStaticPage><MemoryBookBackCoverPage message={draft.closingMessage} /></MemoryBookStaticPage>
  }
  const spread = draft.spreads[selectedPage]
  if (!spread) return null
  const page = buildPreviewStoryPage(spread, assetMap)
  return <MemoryBookStaticPage><MemoryBookStoryPage page={page} sourceMap={sourceMap} textureId={`composer-${spread.id}`} /></MemoryBookStaticPage>
}

function buildPreviewStoryPage(
  spread: MemoryBookDraftDocument["spreads"][number],
  assetMap: Map<string, MemoryBookAssetRecord>
): MemoryBookStoryPageData {
  return {
    id: spread.id,
    heading: spread.heading,
    body: spread.body,
    assets: spread.assetIds
      .map((assetId) => assetMap.get(assetId))
      .filter((asset): asset is MemoryBookAssetRecord => Boolean(asset))
      .map((asset) => ({
        id: asset.id,
        mediaType: asset.media_type,
        caption: asset.caption,
        alt: asset.alt_text,
        status: assetStatus(asset),
      })),
  }
}

function UnusedMemories({ assets, sourceMap, canAdd, onAdd, onError }: {
  assets: MemoryBookAssetRecord[]
  sourceMap: Map<string, MemoryBookAssetSource>
  canAdd: boolean
  onAdd: (assetId: string) => void
  onError: () => void
}) {
  return (
    <section className="rounded-xl border border-black/8 bg-white p-4">
      <div><p className="font-bold">Unused memories</p><p className="mt-1 text-xs text-black/45">Removing a photo from a page keeps it here.</p></div>
      {assets.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-lg border border-black/8">
              <MemoryThumbnail asset={asset} source={sourceMap.get(asset.id)} className="aspect-square w-full" onError={onError} />
              <div className="p-2">
                <p className="truncate text-xs font-semibold">{asset.original_label}</p>
                <Button type="button" variant="ghost" size="sm" className="mt-1 w-full" disabled={!canAdd} onClick={() => onAdd(asset.id)}><Plus className="size-4" /> Add to page</Button>
              </div>
            </article>
          ))}
        </div>
      ) : <p className="mt-4 rounded-lg bg-[#f5f5f2] p-4 text-sm text-black/45">Every selected memory is currently used.</p>}
    </section>
  )
}

function ComposerCard({ title, subtitle, selected, thumbnailStrip, onSelect, children }: {
  title: string
  subtitle: string
  selected: boolean
  thumbnailStrip?: React.ReactNode
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <article className={["rounded-xl border bg-white px-4 py-4 transition", selected ? "border-[#47736c] ring-2 ring-[#47736c]/12" : "border-black/8 hover:border-black/18"].join(" ")}>
      <button type="button" className="flex w-full items-center gap-3 text-left" onClick={onSelect}>
        <div className="min-w-0 flex-1"><p className="font-bold">{title}</p><p className="mt-0.5 text-xs text-black/45">{subtitle}</p></div>
        {thumbnailStrip}
        <span className="text-xs font-semibold text-[#47736c]">{selected ? "Editing" : "Edit"}</span>
      </button>
      {children}
    </article>
  )
}

function MemoryThumbnail({ asset, source, className, onError }: {
  asset: MemoryBookAssetRecord
  source?: MemoryBookAssetSource
  className: string
  onError: () => void
}) {
  const src = source?.poster || source?.thumbnail || ""
  const status = assetStatus(asset)
  return (
    <div className={`relative overflow-hidden bg-[#eee9df] ${className}`}>
      {src ? (
        <img src={src} alt={asset.alt_text} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={onError} />
      ) : status === "failed" ? (
        <span className="grid h-full place-items-center text-red-500"><CircleAlert className="size-5" /></span>
      ) : (
        <span className="grid h-full place-items-center text-black/25"><Loader2 className="size-5 animate-spin" /></span>
      )}
      {asset.media_type === "video" ? <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-white">VIDEO</span> : null}
    </div>
  )
}

function Field({ label, hint, compact = false, children }: {
  label: string
  hint?: React.ReactNode
  compact?: boolean
  children: React.ReactNode
}) {
  return <label className={compact ? "mt-3 block" : "block"}><span className="mb-2 flex items-center justify-between text-sm font-semibold">{label}{hint ? <span className="text-xs font-normal text-black/38">{hint}</span> : null}</span>{children}</label>
}

function assetStatus(asset: MemoryBookAssetRecord) {
  if (asset.status === "ready") return "ready" as const
  if (asset.status === "failed") return "failed" as const
  if (asset.status === "processing") return "processing" as const
  return "queued" as const
}

function wordCount(value: string) { return value.trim() ? value.trim().split(/\s+/).length : 0 }
function limitWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return value
  return words.slice(0, maxWords).join(" ")
}