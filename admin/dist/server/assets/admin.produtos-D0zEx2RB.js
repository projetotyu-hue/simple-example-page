import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BK0h1eJs.js";
import { A as AdminLayout, P as Package, X } from "./AdminLayout-D1Ns8z5y.js";
import { c as createLucideIcon, b as composeRefs, u as useComposedRefs, L as LoaderCircle, s as supabase, E as Eye } from "./useAuth-BDGmCldG.js";
import { b as useControllableState, d as useId, f as Presence, P as Primitive, e as composeEventHandlers, c as createContextScope, g as createContext2 } from "./index-DVzB7Mzx.js";
import { P as Portal$1, R as ReactRemoveScroll, h as hideOthers, u as useFocusGuards, F as FocusScope, D as DismissableLayer } from "./Combination-C_8oOiyp.js";
import { P as Plus, T as Trash2 } from "./trash-2-De-lS6-V.js";
import { P as Pencil } from "./pencil-BfzpVuHk.js";
import { I as ImagePlus } from "./image-plus-yxs4hOD7.js";
import { E as EyeOff } from "./eye-off-my6MYQlz.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BORuSdfU.js";
const __iconNode$2 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = /* @__PURE__ */ Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog;
var Portal = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
const SHIPPING_OPTIONS = [{
  id: "padrao",
  label: "Padrão (grátis)",
  price: 0,
  days: 0
}, {
  id: "padrao-pago",
  label: "Entrega Padrão (R$ 19,90 - 10 dias)",
  price: 19.9,
  days: 10
}, {
  id: "expressa",
  label: "Entrega Expressa (R$ 29,90 - 7 dias)",
  price: 29.9,
  days: 7
}];
const TOP_POSITIONS = [{
  value: "",
  label: "Sem posição"
}, {
  value: "1",
  label: "TOP 1"
}, {
  value: "2",
  label: "TOP 2"
}, {
  value: "3",
  label: "TOP 3"
}];
function ProdutosPage() {
  const [items, setItems] = reactExports.useState([]);
  const [deletingIds, setDeletingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [confirmingId, setConfirmingId] = reactExports.useState(null);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  async function load() {
    setLoading(true);
    setError(null);
    const [p, c] = await Promise.all([supabase.from("products").select("*").order("position", {
      ascending: true
    }), supabase.from("categories").select("id,name").order("name")]);
    if (p.error) setError("Erro ao carregar produtos");
    setItems(p.data ?? []);
    setCategories(c.data ?? []);
    setLoading(false);
  }
  reactExports.useEffect(() => {
    void load();
  }, []);
  async function handleDelete(p) {
    setConfirmingId(null);
    setDeletingIds((prev) => new Set(prev).add(p.id));
    const {
      error: error2
    } = await supabase.from("products").delete().eq("id", p.id);
    if (error2) {
      alert("Erro ao excluir");
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(p.id);
        return next;
      });
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(p.id);
      return next;
    });
  }
  const filteredItems = items.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Produtos", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        items.length,
        " produto(s)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setEditing(null);
        setShowForm(true);
      }, className: "flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Novo produto"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-search text-muted-foreground shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-4.34-4.34" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar por nome ou categoria...", className: "flex-1 bg-transparent text-sm outline-none text-foreground placeholder-gray-400", type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 flex justify-center bg-card rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-muted-foreground bg-card rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Nenhum produto cadastrado ainda." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "NOME" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "PREÇO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "ESTOQUE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "TOP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "STATUS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "VENDAS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "AÇÕES" })
      ] }),
      filteredItems.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px_1fr_auto] gap-4 px-5 py-3.5 items-center border-b border-gray-50 last:border-b-0 transition-all duration-300 ${deletingIds.has(p.id) ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"} ${confirmingId === p.id ? "bg-red-50/50" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground w-8", children: p.position || items.length - i }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { alt: p.name, className: "w-10 h-10 rounded-lg object-cover bg-muted shrink-0", src: p.image_url }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: categories.find((c) => c.id === p.category_id)?.name || p.category || "sem categoria" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
            "R$ ",
            Number(p.price).toFixed(2).replace(".", ",")
          ] }),
          p.original_price && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-through", children: [
            "R$ ",
            Number(p.original_price).toFixed(2).replace(".", ",")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: p.stock ?? 500 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: p.badge || "Nenhum" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          const {
            error: error2
          } = await supabase.from("products").update({
            featured: !p.featured
          }).eq("id", p.id);
          if (!error2) void load();
        }, className: `text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider w-fit transition-colors ${p.featured ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-red-500 bg-red-50 hover:bg-red-100"}`, children: [
          "● ",
          p.featured ? "Ativo" : "Inativo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: p.sales_count || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/produto/${p.id}`, target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-eye", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setEditing(p);
            setShowForm(true);
          }, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmingId(p.id), className: "p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, p.id)),
      filteredItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 my-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-chevron-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m15 18-6-6 6-6" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-8 h-8 rounded-lg text-sm transition-colors bg-primary text-white font-medium", children: "1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-chevron-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m9 18 6-6-6-6" }) }) })
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductFormModal, { product: editing, categories, onClose: () => setShowForm(false), onSaved: () => {
      setShowForm(false);
      void load();
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open: !!confirmingId, onOpenChange: (open) => !open && setConfirmingId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { className: "fixed inset-0 bg-black/50 z-50 animate-in fade-in-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { className: "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-2xl p-6 shadow-xl animate-in zoom-in-95 fade-in-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-red-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 28, className: "text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-lg font-bold text-gray-900", children: "Excluir produto?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { className: "text-sm text-gray-500 mt-1", children: "Essa ação não pode ser desfeita. O produto será removido permanentemente." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 w-full mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setConfirmingId(null), className: "flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            const p = items.find((x) => x.id === confirmingId);
            if (p) void handleDelete(p);
          }, className: "flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors", children: "Excluir" })
        ] })
      ] }) })
    ] }) })
  ] });
}
function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved
}) {
  const [activeTab, setActiveTab] = reactExports.useState("dados");
  const [name, setName] = reactExports.useState(product?.name ?? "");
  const [description, setDescription] = reactExports.useState(product?.description ?? "");
  const [price, setPrice] = reactExports.useState(product?.price ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = reactExports.useState(product?.original_price ? String(product.original_price) : "");
  const [stock, setStock] = reactExports.useState(product?.stock ? String(product.stock) : "500");
  const [categoryId, setCategoryId] = reactExports.useState(product?.category_id ?? "");
  const [badge, setBadge] = reactExports.useState(product?.badge ?? "");
  const [imageUrls, setImageUrls] = reactExports.useState(product?.additional_images ?? (product?.image_url ? [product.image_url] : []));
  const [uploading, setUploading] = reactExports.useState(false);
  const [variations, setVariations] = reactExports.useState([]);
  const [showVariationForm, setShowVariationForm] = reactExports.useState(false);
  const [varName, setVarName] = reactExports.useState("");
  const [varValue, setVarValue] = reactExports.useState("");
  const [varQtd, setVarQtd] = reactExports.useState("");
  const [varPrice, setVarPrice] = reactExports.useState("");
  const [varImageUrls, setVarImageUrls] = reactExports.useState([]);
  const [varUploading, setVarUploading] = reactExports.useState(false);
  const [featured, setFeatured] = reactExports.useState(product?.featured ?? false);
  const [isPrimary, setIsPrimary] = reactExports.useState(product?.is_primary ?? false);
  const [primaryOrder, setPrimaryOrder] = reactExports.useState(product?.primary_order ? String(product.primary_order) : "");
  const [shippingOptionId, setShippingOptionId] = reactExports.useState(product?.shipping_option_id ?? "padrao");
  const [customizationLabel, setCustomizationLabel] = reactExports.useState(product?.customization_label ?? "");
  const [videoUrl, setVideoUrl] = reactExports.useState(product?.video_url ?? "");
  const [infoImageUrls, setInfoImageUrls] = reactExports.useState(product?.info_images ?? []);
  const [infoUploading, setInfoUploading] = reactExports.useState(false);
  const infoFileRef = reactExports.useRef(null);
  const [giftTitle, setGiftTitle] = reactExports.useState(product?.gift_title ?? "");
  const [giftDescription, setGiftDescription] = reactExports.useState(product?.gift_description ?? "");
  const [giftImageUrls, setGiftImageUrls] = reactExports.useState(product?.gift_image_url ? [product.gift_image_url] : []);
  const [giftUploading, setGiftUploading] = reactExports.useState(false);
  const giftFileRef = reactExports.useRef(null);
  const [bonusEnabled, setBonusEnabled] = reactExports.useState(product?.bonus_enabled ?? false);
  const [bonusTitle, setBonusTitle] = reactExports.useState(product?.bonus_title ?? "");
  const [bonusDescription, setBonusDescription] = reactExports.useState(product?.bonus_description ?? "");
  const [bonusHighlight, setBonusHighlight] = reactExports.useState(product?.bonus_highlight ?? "");
  const [bonusWarning, setBonusWarning] = reactExports.useState(product?.bonus_warning ?? "");
  const [reviewsTotal, setReviewsTotal] = reactExports.useState(product?.reviews_total ?? "");
  const [reviews, setReviews] = reactExports.useState([]);
  const [loadingReviews, setLoadingReviews] = reactExports.useState(false);
  const [showReviews, setShowReviews] = reactExports.useState(false);
  const [showReviewForm, setShowReviewForm] = reactExports.useState(false);
  const [editingReview, setEditingReview] = reactExports.useState(null);
  const [reviewName, setReviewName] = reactExports.useState("");
  const [reviewRating, setReviewRating] = reactExports.useState(5);
  const [reviewComment, setReviewComment] = reactExports.useState("");
  const [reviewAvatarUrl, setReviewAvatarUrl] = reactExports.useState("");
  const [reviewVariation, setReviewVariation] = reactExports.useState("");
  const [reviewDaysAgo, setReviewDaysAgo] = reactExports.useState("");
  const [reviewLikes, setReviewLikes] = reactExports.useState("0");
  const [reviewUploading, setReviewUploading] = reactExports.useState(false);
  const reviewFileRef = reactExports.useRef(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const varFileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (product?.id) {
      loadVariations(product.id);
      loadReviews(product.id);
    }
  }, [product?.id]);
  async function loadVariations(productId) {
    const {
      data,
      error
    } = await supabase.from("product_variations").select("*").eq("product_id", productId);
    if (!error && data) {
      setVariations(data.map((v) => ({
        id: v.id,
        product_id: v.product_id,
        name: v.name,
        value: v.value,
        qtd: v.qtd,
        price: v.price,
        image_urls: v.image_urls ?? []
      })));
    }
  }
  async function loadReviews(productId) {
    setLoadingReviews(true);
    const {
      data,
      error
    } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", {
      ascending: false
    });
    if (!error && data) {
      setReviews(data);
    }
    setLoadingReviews(false);
  }
  async function handleUpload(file, isVariation = false) {
    if (isVariation) setVarUploading(true);
    else setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("product-images").getPublicUrl(path);
      if (isVariation) {
        setVarImageUrls((prev) => [...prev, data.publicUrl]);
      } else {
        setImageUrls((prev) => [...prev, data.publicUrl]);
      }
    } catch {
      setErr("Erro ao enviar imagem");
    } finally {
      if (isVariation) setVarUploading(false);
      else setUploading(false);
    }
  }
  function removeImage(index) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }
  function removeVarImage(index) {
    setVarImageUrls((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleGiftUpload(file) {
    setGiftUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `gifts/${crypto.randomUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("product-images").getPublicUrl(path);
      setGiftImageUrls((prev) => [...prev, data.publicUrl]);
    } catch {
      setErr("Erro ao enviar imagem do brinde");
    } finally {
      setGiftUploading(false);
    }
  }
  function removeGiftImage(index) {
    setGiftImageUrls((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleInfoUpload(file) {
    setInfoUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `info/${crypto.randomUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("product-images").getPublicUrl(path);
      setInfoImageUrls((prev) => [...prev, data.publicUrl]);
    } catch {
      setErr("Erro ao enviar imagem adicional");
    } finally {
      setInfoUploading(false);
    }
  }
  function removeInfoImage(index) {
    setInfoImageUrls((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleReviewUpload(file) {
    setReviewUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `reviews/${crypto.randomUUID()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("product-images").getPublicUrl(path);
      setReviewAvatarUrl(data.publicUrl);
    } catch {
      setErr("Erro ao enviar imagem da avaliação");
    } finally {
      setReviewUploading(false);
    }
  }
  function startEditReview(r) {
    setEditingReview(r);
    setReviewName(r.author_name);
    setReviewRating(r.rating);
    setReviewComment(r.comment ?? "");
    setReviewAvatarUrl(r.avatar_url ?? "");
    setReviewVariation(r.variation ?? "");
    setReviewDaysAgo(r.days_ago?.toString() ?? "0");
    setReviewLikes(r.likes?.toString() ?? "0");
    setShowReviewForm(true);
  }
  function startNewReview() {
    setEditingReview(null);
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    setReviewAvatarUrl("");
    setReviewVariation("");
    setReviewDaysAgo("0");
    setReviewLikes("0");
    setShowReviewForm(true);
  }
  async function saveReview(e) {
    e.preventDefault();
    if (!product?.id) return;
    setErr(null);
    try {
      const payload = {
        author_name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim() || null,
        avatar_url: reviewAvatarUrl || null,
        variation: reviewVariation.trim() || null,
        days_ago: reviewDaysAgo ? parseInt(reviewDaysAgo) : 0,
        likes: reviewLikes ? parseInt(reviewLikes) : 0
      };
      if (editingReview?.id) {
        const {
          error
        } = await supabase.from("reviews").update(payload).eq("id", editingReview.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("reviews").insert([{
          ...payload,
          product_id: product.id
        }]);
        if (error) throw error;
      }
      setShowReviewForm(false);
      setEditingReview(null);
      loadReviews(product.id);
    } catch (e2) {
      setErr(e2.message || "Erro ao salvar avaliação");
    }
  }
  async function deleteReview(reviewId) {
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      const {
        error
      } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
      if (product?.id) loadReviews(product.id);
    } catch (e) {
      setErr(e.message || "Erro ao excluir");
    }
  }
  function addVariation() {
    if (!varName.trim() || !varValue.trim() || !varQtd) {
      setErr("Preencha nome, valor e quantidade da variação");
      return;
    }
    const newVar = {
      name: varName.trim(),
      value: varValue.trim(),
      qtd: parseInt(varQtd),
      price: varPrice ? parseFloat(varPrice.replace(",", ".")) : void 0,
      image_urls: varImageUrls.length > 0 ? [...varImageUrls] : void 0
    };
    setVariations((prev) => [...prev, newVar]);
    setVarName("");
    setVarValue("");
    setVarQtd("");
    setVarPrice("");
    setVarImageUrls([]);
    setShowVariationForm(false);
    setErr(null);
  }
  function removeVariation(index) {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price) {
      setErr("Nome e preço são obrigatórios");
      return;
    }
    setSaving(true);
    setErr(null);
    const priceNum = parseFloat(price.replace(",", "."));
    const originalPriceNum = originalPrice ? parseFloat(originalPrice.replace(",", ".")) : null;
    const discount = originalPriceNum && originalPriceNum > priceNum ? Math.round((originalPriceNum - priceNum) / originalPriceNum * 100) : null;
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      original_price: originalPriceNum,
      discount_percent: discount,
      category_id: categoryId || null,
      category: selectedCategory?.name ?? null,
      badge: badge.trim() || null,
      image_url: imageUrls[0] ?? null,
      additional_images: imageUrls.length > 0 ? imageUrls : null,
      featured,
      free_shipping: shippingOptionId === "padrao",
      stock: stock ? parseInt(stock) : null,
      is_primary: isPrimary,
      primary_order: primaryOrder ? parseInt(primaryOrder) : null,
      shipping_option_id: shippingOptionId,
      customization_label: customizationLabel.trim() || null,
      reviews_total: reviewsTotal.trim() || null,
      video_url: videoUrl.trim() || null,
      bonus_enabled: bonusEnabled,
      bonus_title: bonusTitle.trim() || null,
      bonus_description: bonusDescription.trim() || null,
      bonus_highlight: bonusHighlight.trim() || null,
      bonus_warning: bonusWarning.trim() || null,
      gift_title: giftTitle.trim() || null,
      gift_description: giftDescription.trim() || null,
      gift_image_url: giftImageUrls.length > 0 ? giftImageUrls[0] : null,
      info_images: infoImageUrls.length > 0 ? infoImageUrls : null,
      section: primaryOrder && ["1", "2", "3"].includes(primaryOrder) ? "top" : product?.section === "top" ? "all" : product?.section ?? "all"
    };
    try {
      let productId = product?.id;
      if (product) {
        const {
          error
        } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const {
          data,
          error
        } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      }
      if (productId && variations.length > 0) {
        if (product) {
          await supabase.from("product_variations").delete().eq("product_id", productId);
        }
        const variationsPayload = variations.map((v) => ({
          product_id: productId,
          name: v.name,
          value: v.value,
          qtd: v.qtd,
          price: v.price,
          image_urls: v.image_urls
        }));
        const {
          error: varError
        } = await supabase.from("product_variations").insert(variationsPayload);
        if (varError) throw varError;
      }
      onSaved();
    } catch (e2) {
      setErr(e2.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: product ? "Editar produto" : "Novo produto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-6 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("dados"), className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "dados" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Dados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setActiveTab("avaliacoes");
        if (product?.id && !showReviews) {
          setShowReviews(true);
          loadReviews(product.id);
        }
      }, className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "avaliacoes" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
        "Avaliações (",
        reviews.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("conteudo"), className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "conteudo" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Conteúdo Adicional" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
      activeTab === "dados" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-foreground mb-2", children: "Imagens do produto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-2 min-h-[88px]", children: [
            imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20 rounded-lg border border-border overflow-hidden group shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(i), className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => fileRef.current?.click(), disabled: uploading, className: "w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60 shrink-0", children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((f) => void handleUpload(f));
            e.target.value = "";
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: imageUrls.join(", "), onChange: (e) => {
            const urls = e.target.value.split(",").map((u) => u.trim()).filter(Boolean);
            setImageUrls(urls);
          }, placeholder: "ou cole URLs separadas por vírgula", className: "mt-2 w-full px-3 py-1.5 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Descrição", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none min-h-[80px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preço (R$)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: price, onChange: (e) => setPrice(e.target.value), placeholder: "29,90", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preço original (opcional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: originalPrice, onChange: (e) => setOriginalPrice(e.target.value), placeholder: "59,90", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Estoque", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: stock, onChange: (e) => setStock(e.target.value), placeholder: "500", type: "number", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Categoria", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: categoryId, onChange: (e) => setCategoryId(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Sem categoria —" }),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Selo (badge)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: badge, onChange: (e) => setBadge(e.target.value), placeholder: "Ex: NOVIDADE", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Opção de frete", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: shippingOptionId, onChange: (e) => setShippingOptionId(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9", children: SHIPPING_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.id, children: opt.label }, opt.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Posição no TOP", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: primaryOrder, onChange: (e) => {
            setPrimaryOrder(e.target.value);
            if (e.target.value) setIsPrimary(true);
          }, className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary bg-card h-9", children: TOP_POSITIONS.map((pos) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: pos.value, children: pos.label }, pos.value)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Total de avaliações exibido", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: reviewsTotal, onChange: (e) => setReviewsTotal(e.target.value), placeholder: "Ex: 210", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Campo de personalização (opcional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: customizationLabel, onChange: (e) => setCustomizationLabel(e.target.value), placeholder: "Ex: Nome para bordado, Texto para gravação...", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleSwitch, { label: "Exibir na página inicial", checked: featured, onChange: setFeatured }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleSwitch, { label: "Produto principal", checked: isPrimary, onChange: setIsPrimary })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Variações do produto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setShowVariationForm(!showVariationForm), className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Adicionar variação"
            ] })
          ] }),
          showVariationForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-4 mb-3 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome (ex: Cor)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: varName, onChange: (e) => setVarName(e.target.value), placeholder: "Cor", className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Valor (ex: Azul)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: varValue, onChange: (e) => setVarValue(e.target.value), placeholder: "Azul", className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Qtd (estoque)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: varQtd, onChange: (e) => setVarQtd(e.target.value), placeholder: "10", type: "number", className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preço específico (opcional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: varPrice, onChange: (e) => setVarPrice(e.target.value), placeholder: "29,90", className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-foreground mb-1", children: "Imagens da variação" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-2", children: [
                varImageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-16 h-16 rounded-lg border border-border overflow-hidden group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeVarImage(i), className: "absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" }) })
                ] }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => varFileRef.current?.click(), disabled: varUploading, className: "w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60", children: varUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: varFileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((f) => void handleUpload(f, true));
                e.target.value = "";
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setShowVariationForm(false);
                setVarName("");
                setVarValue("");
                setVarQtd("");
                setVarPrice("");
                setVarImageUrls([]);
              }, className: "px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors", children: "Cancelar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: addVariation, className: "px-3 py-1.5 rounded-lg text-xs bg-primary text-white hover:bg-primary/90 transition-colors", children: "Adicionar" })
            ] })
          ] }),
          variations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: variations.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/20 rounded-lg p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground", children: [
                v.name,
                ": ",
                v.value
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Qtd: ",
                v.qtd,
                " ",
                v.price ? `• R$ ${v.price.toFixed(2).replace(".", ",")}` : ""
              ] }),
              v.image_urls && v.image_urls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-1", children: v.image_urls.map((url, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-8 h-8 rounded object-cover" }, idx)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeVariation(i), className: "p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }, i)) })
        ] })
      ] }),
      activeTab === "avaliacoes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold text-foreground", children: [
            "Avaliações do produto (",
            reviews.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: startNewReview, className: "flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Nova avaliação"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
              if (product?.id) {
                setShowReviews(!showReviews);
                if (!showReviews) loadReviews(product.id);
              }
            }, className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors", children: [
              showReviews ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
              showReviews ? "Ocultar" : "Ver avaliações"
            ] })
          ] })
        ] }),
        showReviewForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome *", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: reviewName, onChange: (e) => setReviewName(e.target.value), placeholder: "Nome do cliente", required: true, className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nota *", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setReviewRating(star), className: "p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-5 w-5 ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}` }) }, star)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Comentário *", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: reviewComment, onChange: (e) => setReviewComment(e.target.value), placeholder: "O que o cliente achou do produto?", required: true, rows: 3, className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Foto do cliente (opcional)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            reviewAvatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: reviewAvatarUrl, alt: "", className: "w-10 h-10 rounded-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => reviewFileRef.current?.click(), disabled: reviewUploading, className: "flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-60", children: [
              reviewUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
              "Adicionar foto"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: reviewFileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) void handleReviewUpload(file);
              e.target.value = "";
            } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setShowReviewForm(false);
              setEditingReview(null);
            }, className: "text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors", children: "Cancelar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: saveReview, className: "text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors", children: "Salvar" })
          ] })
        ] }),
        !showReviewForm && loadingReviews ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : !showReviews ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-muted-foreground", children: 'Clique em "Ver avaliações" para carregar as avaliações deste produto.' }) : reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-muted-foreground", children: "Nenhuma avaliação encontrada para este produto." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: reviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              r.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.avatar_url, alt: "", className: "w-6 h-6 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary", children: r.author_name.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: r.author_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-3.5 w-3.5 ${star <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}` }, star)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(r.created_at).toLocaleDateString("pt-BR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => startEditReview(r), className: "p-1 text-muted-foreground hover:text-primary transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => deleteReview(r.id), className: "p-1 text-muted-foreground hover:text-red-500 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }),
          r.comment && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: r.comment }),
          (r.variation || r.days_ago !== void 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2 text-xs text-muted-foreground", children: [
            r.variation && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Variação: ",
              r.variation
            ] }),
            r.days_ago !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Há ",
              r.days_ago,
              " dias"
            ] }),
            r.likes !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "👍 ",
              r.likes
            ] })
          ] })
        ] }, r.id)) })
      ] }),
      activeTab === "conteudo" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground", children: "🖼️ Imagens adicionais" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-2", children: "Exibidas na página do produto antes das avaliações, uma abaixo da outra" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-2", children: [
            infoImageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-24 h-24 rounded-lg border border-border overflow-hidden group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeInfoImage(i), className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => infoFileRef.current?.click(), disabled: infoUploading, className: "w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60", children: infoUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-6 w-6 mb-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Adicionar" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: infoFileRef, type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((f) => void handleInfoUpload(f));
            e.target.value = "";
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Link do vídeo (opcional)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: videoUrl, onChange: (e) => setVideoUrl(e.target.value), placeholder: "https://youtube.com/watch?v=...", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "YouTube ou qualquer link de vídeo" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground", children: "🎁 Configuração do Bloco de Brinde" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleSwitch, { label: "Ativar Brinde", checked: bonusEnabled, onChange: setBonusEnabled })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Título do Bloco", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bonusTitle, onChange: (e) => setBonusTitle(e.target.value), placeholder: "Ex: 🎁 BRINDE EXCLUSIVO!", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Aviso de Validade", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bonusWarning, onChange: (e) => setBonusWarning(e.target.value), placeholder: "Ex: ⚡ Oferta válida apenas hoje", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Texto da Oferta", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bonusDescription, onChange: (e) => setBonusDescription(e.target.value), placeholder: "Ex: Comprando hoje, você recebe:", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Destaque (Brinde)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bonusHighlight, onChange: (e) => setBonusHighlight(e.target.value), placeholder: "Ex: 1 Capacete GRÁTIS!", className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary h-9" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Imagem do brinde", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-2", children: [
              giftImageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20 rounded-lg border border-border overflow-hidden group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeGiftImage(i), className: "absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" }) })
              ] }, i)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => giftFileRef.current?.click(), disabled: giftUploading, className: "w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60", children: giftUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: giftFileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) void handleGiftUpload(file);
              e.target.value = "";
            } })
          ] })
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 mt-4", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t border-border mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving, className: "px-4 py-2 rounded-lg text-sm bg-primary hover:bg-primary/90 text-white disabled:opacity-60 inline-flex items-center gap-2", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Salvar"
        ] })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-foreground mb-1", children: label }),
    children
  ] });
}
function ToggleSwitch({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onChange(!checked), className: "flex items-center gap-3 text-sm text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-300"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}` }) }),
    label
  ] });
}
export {
  ProdutosPage as component
};
