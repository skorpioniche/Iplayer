﻿(

function (n) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery"], n) : n(window.jQuery)
})
(

function (n) {
    "use strict";
    var t = 0;
    n.ajaxTransport("iframe", function (i) {
        if (i.async && (i.type === "POST" || i.type === "GET")) {
            var r, u;
            return {
                send: function (f, e) {
                    r = n('<form style="display:none;"></form>'),
                    u = n('<iframe src="javascript:false;" name="iframe-transport-' + (t += 1) + '"></iframe>')
                        .bind("load", function () {
                            var t;
                            u.unbind("load").bind("load", function () {
                                var t;
                                try {
                                    if (t = u.contents(), !t.length || !t[0].firstChild) throw new Error;
                                } catch (i) {
                                    t = undefined
                                }
                                e(200, "success", {
                                    iframe: t
                                }), n('<iframe src="javascript:false;"></iframe>').appendTo(r), r.remove()
                            }),
                            r.prop("target", u.prop("name")).prop("action", i.url).prop("method", i.type),
                            i.formData && n.each(i.formData, function (t, i) {
                                n('<input type="hidden"/>').prop("name", i.name).val(i.value).appendTo(r)
                            }),
                            i.fileInput && i.fileInput.length && i.type === "POST" && (t = i.fileInput.clone(), i.fileInput.after(function (n) {
                                return t[n]
                            }), i.paramName && i.fileInput.each(function () {
                                n(this).prop("name", i.paramName)
                            }), r.append(i.fileInput).prop("enctype", "multipart/form-data").prop("encoding", "multipart/form-data")), r.submit(), t && t.length && i.fileInput.each(function (i, r) {
                                var u = n(t[i]);
                                n(r).prop("name", u.prop("name")), u.replaceWith(r)
                            })
                        }), r.append(u).appendTo(document.body)
                },
                abort: function () {
                    u && u.unbind("load").prop("src", "javascript".concat(":false;")), r && r.remove()
                }
            }
        }
    }), n.ajaxSetup({
        converters: {
            "iframe text": function (t) {
                return n(t[0].body).text()
            },
            "iframe json": function (t) {
                return n.parseJSON(n(t[0].body).text())
            },
            "iframe html": function (t) {
                return n(t[0].body).html()
            },
            "iframe script": function (t) {
                return n.globalEval(n(t[0].body).text())
            }
        }
    })
}),

function (n) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery", "jquery.ui.widget"], n) : n(window.jQuery)
}
(

function (n) {
    "use strict";
    n.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader),
    n.support.xhrFormDataFileUpload = !!window.FormData, n.widget("blueimp.fileupload", {
        options: {
            namespace: undefined,
            dropZone: n(document),
            fileInput: undefined,
            replaceFileInput: !0,
            paramName: undefined,
            singleFileUploads: !0,
            limitMultiFileUploads: undefined,
            sequentialUploads: !1,
            limitConcurrentUploads: undefined,
            forceIframeTransport: !1,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: !0,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: !0,
            formData: function (n) {
                return n.serializeArray()
            },
            add: function (n, t) {
                t.submit()
            },
            processData: !1,
            contentType: !1,
            cache: !1
        },
        _refreshOptionsList: ["namespace", "dropZone", "fileInput", "multipart", "forceIframeTransport"],
        _isXHRUpload: function (t) {
            return !t.forceIframeTransport && (!t.multipart && n.support.xhrFileUpload || n.support.xhrFormDataFileUpload)
        },
        _getFormData: function (t) {
            var i;
            return typeof t.formData == "function" ? t.formData(t.form) : n.isArray(t.formData) ? t.formData : t.formData ?
                (i = [], n.each(t.formData, function (n, t) {
                    i.push({
                        name: n,
                        value: t
                    })
                }), i) : []
        },
        _getTotal: function (t) {
            var i = 0;
            return n.each(t, function (n, t) {
                i += t.size || 1
            }), i
        },
        _onProgress: function (n, t) {
            if (n.lengthComputable) {
                var i = t.total || this._getTotal(t.files),
                    r = parseInt(n.loaded / n.total * (t.chunkSize || i), 10) + (t.uploadedBytes || 0);
                this._loaded += r - (t.loaded || t.uploadedBytes || 0), t.lengthComputable = !0, t.loaded = r,
                t.total = i, this._trigger("progress", n, t), this._trigger("progressall", n, {
                    lengthComputable: !0,
                    loaded: this._loaded,
                    total: this._total
                })
            }
        },
        _initProgressListener: function (t) {
            var r = this,
                i = t.xhr ? t.xhr() : n.ajaxSettings.xhr();
            i.upload && (n(i.upload).bind("progress", function (n) {
                var i = n.originalEvent;
                n.lengthComputable = i.lengthComputable, n.loaded = i.loaded,
                n.total = i.total, r._onProgress(n, t)
            }),
            t.xhr = function () {
                return i
            })
        },
        _initXHRData: function (t) {
            var i, r = t.files[0],
                u = t.multipart || !n.support.xhrFileUpload;
            (!u || t.blob) && (t.headers = n.extend(t.headers, {
                "X-File-Name": r.name,
                "X-File-Type": r.type,
                "X-File-Size": r.size
            }),
            t.blob ? u || (t.contentType = "application/octet-stream", t.data = t.blob) : (t.contentType = r.type, t.data = r)),
            u && n.support.xhrFormDataFileUpload && (t.postMessage ? (i = this._getFormData(t), t.blob ? i.push({
                name: t.paramName,
                value: t.blob
            }) :
                n.each(t.files, function (n, r) {
                    i.push({
                        name: t.paramName,
                        value: r
                    })
                })) :
                (t.formData instanceof FormData ? i = t.formData : (i = new FormData, n.each(this._getFormData(t), function (n, t) {
                    i.append(t.name, t.value)
                })), t.blob ? i.append(t.paramName, t.blob, r.name) : n.each(t.files, function (n, r) {
                    r instanceof Blob && i.append(t.paramName, r, r.name)
                })), t.data = i), t.blob = null
        },
        _initIframeSettings: function (t) {
            t.dataType = "iframe " + (t.dataType || ""), t.formData = this._getFormData(t), t.redirect && n("<a></a>").prop("href", t.url).prop("host") !== location.host && t.formData.push({
                name: t.redirectParamName || "redirect",
                value: t.redirect
            })
        },
        _initDataSettings: function (n) {
            this._isXHRUpload(n) ? (this._chunkedUpload(n, !0) || (n.data || this._initXHRData(n), this._initProgressListener(n)), n.postMessage && (n.dataType = "postmessage " + (n.dataType || ""))) : this._initIframeSettings(n, "iframe")
        },
        _initFormSettings: function (t) {
            t.form && t.form.length || (t.form = n(t.fileInput.prop("form"))), t.paramName || (t.paramName = t.fileInput.prop("name") || "files[]"), t.url || (t.url = t.form.prop("action") || location.href), t.type = (t.type || t.form.prop("method") || "").toUpperCase(), t.type !== "POST" && t.type !== "PUT" && (t.type = "POST")
        },
        _getAJAXSettings: function (t) {
            var i = n.extend({}, this.options, t);
            return this._initFormSettings(i), this._initDataSettings(i), i
        },
        _enhancePromise: function (n) {
            return n.success = n.done, n.error = n.fail, n.complete = n.always, n
        },
        _getXHRPromise: function (t, i, r) {
            var u = n.Deferred(),
                f = u.promise();
            return i = i || this.options.context || f, t === !0 ? u.resolveWith(i, r) : t === !1 && u.rejectWith(i, r), f.abort = u.promise, this._enhancePromise(f)
        },
        _chunkedUpload: function (t, i) {
            var u = this,
                r = t.files[0],
                e = r.size,
                f = t.uploadedBytes = t.uploadedBytes || 0,
                o = t.maxChunkSize || e,
                l = r.webkitSlice || r.mozSlice || r.slice,
                s, a, h, c;
            return !(this._isXHRUpload(t) && l && (f || o < e)) || t.data ? !1 : i ? !0 : f >= e ? (r.error = "uploadedBytes", this._getXHRPromise(!1, t.context, [null, "error", r.error])) : (a = Math.ceil((e - f) / o), s = function (i) {
                return i ? s(i -= 1).pipe(function () {
                    var e = n.extend({}, t);
                    return e.blob = l.call(r, f + i * o, f + (i + 1) * o), e.chunkSize = e.blob.size, u._initXHRData(e), u._initProgressListener(e), h = (n.ajax(e) || u._getXHRPromise(!1, e.context)).done(function () {
                        e.loaded || u._onProgress(n.Event("progress", {
                            lengthComputable: !0,
                            loaded: e.chunkSize,
                            total: e.chunkSize
                        }), e), t.uploadedBytes = e.uploadedBytes += e.chunkSize
                    })
                }) : u._getXHRPromise(!0, t.context)
            }, c = s(a), c.abort = function () {
                return h.abort()
            }, this._enhancePromise(c))
        },
        _beforeSend: function (n, t) {
            this._active === 0 && this._trigger("start"), this._active += 1, this._loaded += t.uploadedBytes || 0, this._total += this._getTotal(t.files)
        },
        _onDone: function (t, i, r, u) {
            this._isXHRUpload(u) || this._onProgress(n.Event("progress", {
                lengthComputable: !0,
                loaded: 1,
                total: 1
            }), u), u.result = t, u.textStatus = i, u.jqXHR = r, this._trigger("done", null, u)
        },
        _onFail: function (n, t, i, r) {
            r.jqXHR = n, r.textStatus = t, r.errorThrown = i, this._trigger("fail", null, r), r.recalculateProgress && (this._loaded -= r.loaded || r.uploadedBytes || 0, this._total -= r.total || this._getTotal(r.files))
        },
        _onAlways: function (n, t, i, r) {
            this._active -= 1, r.textStatus = t, i && i.always ? (r.jqXHR = i, r.result = n) : (r.jqXHR = n, r.errorThrown = i), this._trigger("always", null, r), this._active === 0 && (this._trigger("stop"), this._loaded = this._total = 0)
        },
        _onSend: function (t, i) {
            var r = this,
                f, e, s, u = r._getAJAXSettings(i),
                o = function (i, e) {
                    return r._sending += 1, f = f || (i !== !1 && r._trigger("send", t, u) !== !1 && (r._chunkedUpload(u) || n.ajax(u)) || r._getXHRPromise(!1, u.context, e)).done(function (n, t, i) {
                        r._onDone(n, t, i, u)
                    }).fail(function (n, t, i) {
                        r._onFail(n, t, i, u)
                    }).always(function (n, t, i) {
                        if (r._sending -= 1, r._onAlways(n, t, i, u), u.limitConcurrentUploads && u.limitConcurrentUploads > r._sending) for (var f = r._slots.shift() ; f;) {
                            if (!f.isRejected()) {
                                f.resolve();
                                break
                            }
                            f = r._slots.shift()
                        }
                    })
                };
            return (this._beforeSend(t, u), this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending) ? (this.options.limitConcurrentUploads > 1 ? (e = n.Deferred(), this._slots.push(e), s = e.pipe(o)) : s = this._sequence = this._sequence.pipe(o, o), s.abort = function () {
                var n = [undefined, "abort", "abort"];
                return f ? f.abort() : (e && e.rejectWith(n), o(!1, n))
            }, this._enhancePromise(s)) : o()
        },
        _onAdd: function (t, i) {
            var o = this,
                s = !0,
                f = n.extend({}, this.options, i),
                e = f.limitMultiFileUploads,
                r, u;
            if ((f.singleFileUploads || e) && this._isXHRUpload(f)) {
                if (!f.singleFileUploads && e) for (r = [], u = 0; u < i.files.length; u += e) r.push(i.files.slice(u, u + e))
            } else r = [i.files];
            return i.originalFiles = i.files, n.each(r || i.files, function (u, f) {
                var h = r ? f : [f],
                    e = n.extend({}, i, {
                        files: h
                    });
                return e.submit = function () {
                    return e.jqXHR = this.jqXHR = o._trigger("submit", t, this) !== !1 && o._onSend(t, this), this.jqXHR
                }, s = o._trigger("add", t, e)
            }), s
        },
        _normalizeFile: function (n, t) {
            t.name === undefined && t.size === undefined && (t.name = t.fileName, t.size = t.fileSize)
        },
        _replaceFileInput: function (t) {
            var i = t.clone(!0);
            n("<form></form>").append(i)[0].reset(), t.after(i).detach(), n.cleanData(t.unbind("remove")), this.options.fileInput = this.options.fileInput.map(function (n, r) {
                return r === t[0] ? i[0] : r
            }), t[0] === this.element[0] && (this.element = i)
        },
        _onChange: function (t) {
            var i = t.data.fileupload,
                r = {
                    files: n.each(n.makeArray(t.target.files), i._normalizeFile),
                    fileInput: n(t.target),
                    form: n(t.target.form)
                };
            return r.files.length || (r.files = [{
                name: t.target.value.replace(/^.*\\/, "")
            }]), i.options.replaceFileInput && i._replaceFileInput(r.fileInput), i._trigger("change", t, r) === !1 || i._onAdd(t, r) === !1 ? !1 : void 0
        },
        _onPaste: function (t) {
            var r = t.data.fileupload,
                u = t.originalEvent.clipboardData,
                f = u && u.items || [],
                i = {
                    files: []
                };
            return n.each(f, function (n, t) {
                var r = t.getAsFile && t.getAsFile();
                r && i.files.push(r)
            }), r._trigger("paste", t, i) === !1 || r._onAdd(t, i) === !1 ? !1 : void 0
        },
        _onDrop: function (t) {
            
            var i = t.data.fileupload,
                r = t.dataTransfer = t.originalEvent.dataTransfer,
                u = {
                    files: n.each(n.makeArray(r && r.files), i._normalizeFile)
                };

            if (i._trigger("drop", t, u) === !1 || i._onAdd(t, u) === !1) return !1;
            t.preventDefault()
        },
        _onDragOver: function (n) {
            var i = n.data.fileupload,
                t = n.dataTransfer = n.originalEvent.dataTransfer;
            if (i._trigger("dragover", n) === !1) return !1;
            t && (t.dropEffect = t.effectAllowed = "copy"), n.preventDefault()
        },
        _initEventHandlers: function () {
            var n = this.options.namespace;
            this._isXHRUpload(this.options) && this.options.dropZone.bind("dragover." + n, {
                fileupload: this
            }, this._onDragOver).bind("drop." + n, {
                fileupload: this
            }, this._onDrop).bind("paste." + n, {
                fileupload: this
            }, this._onPaste), this.options.fileInput.bind("change." + n, {
                fileupload: this
            }, this._onChange)
        },
        _destroyEventHandlers: function () {
            var n = this.options.namespace;
            this.options.dropZone.unbind("dragover." + n, this._onDragOver).unbind("drop." + n, this._onDrop).unbind("paste." + n, this._onPaste), this.options.fileInput.unbind("change." + n, this._onChange)
        },
        _setOption: function (t, i) {
            var r = n.inArray(t, this._refreshOptionsList) !== -1;
            r && this._destroyEventHandlers(), n.Widget.prototype._setOption.call(this, t, i), r && (this._initSpecialOptions(), this._initEventHandlers())
        },
        _initSpecialOptions: function () {
            var t = this.options;
            t.fileInput === undefined ? t.fileInput = this.element.is("input:file") ? this.element : this.element.find("input:file") : t.fileInput instanceof n || (t.fileInput = n(t.fileInput)), t.dropZone instanceof n || (t.dropZone = n(t.dropZone))
        },
        _create: function () {
            var t = this.options,
                i = n.extend({}, this.element.data());
            i[this.widgetName] = undefined, n.extend(t, i), t.namespace = t.namespace || this.widgetName, this._initSpecialOptions(), this._slots = [], this._sequence = this._getXHRPromise(!0), this._sending = this._active = this._loaded = this._total = 0, this._initEventHandlers()
        },
        destroy: function () {
            this._destroyEventHandlers(), n.Widget.prototype.destroy.call(this)
        },
        enable: function () {
            n.Widget.prototype.enable.call(this), this._initEventHandlers()
        },
        disable: function () {
            this._destroyEventHandlers(), n.Widget.prototype.disable.call(this)
        },
        add: function (t) {
            t && !this.options.disabled && (t.files = n.each(n.makeArray(t.files), this._normalizeFile), this._onAdd(null, t))
        },
        send: function (t) {
            return t && !this.options.disabled && (t.files = n.each(n.makeArray(t.files), this._normalizeFile), t.files.length) ? this._onSend(null, t) : this._getXHRPromise(!1, t && t.context)
        }
    })
}),
function (n) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery", "load-image", "canvas-to-blob", "./jquery.fileupload"], n) : n(window.jQuery, window.loadImage, window.canvasToBlob)
}(function (n, t, i) {
    "use strict";
    n.widget("blueimpIP.fileupload", n.blueimp.fileupload, {
        options: {
            resizeSourceFileTypes: /^image\/(gif|jpeg|png)$/,
            resizeSourceMaxFileSize: 2e7,
            resizeMaxWidth: undefined,
            resizeMaxHeight: undefined,
            resizeMinWidth: undefined,
            resizeMinHeight: undefined,
            add: function (t, i) {
                n(this).fileupload("resize", i).done(function () {
                    i.submit()
                })
            }
        },
        _resizeImage: function (r, u, f) {
            var h = this,
                e = r[u],
                s = n.Deferred(),
                o, c;
            return f = f || this.options, t(e, function (n) {
                var c = n.width,
                    l = n.height;
                o = t.scale(n, {
                    maxWidth: f.resizeMaxWidth,
                    maxHeight: f.resizeMaxHeight,
                    minWidth: f.resizeMinWidth,
                    minHeight: f.resizeMinHeight,
                    canvas: !0
                }), c !== o.width || l !== o.height ? i(o, function (n) {
                    n.name || (e.type === n.type ? n.name = e.name : e.name && (n.name = e.name.replace(/\..+$/, "." + n.type.substr(6)))), r[u] = n, s.resolveWith(h)
                }, e) : s.resolveWith(h)
            }), s.promise()
        },
        resize: function (t) {
            var i = this,
                r = n.extend({}, this.options, t),
                u = n.type(r.resizeSourceMaxFileSize) !== "number",
                f = this._isXHRUpload(r);
            return n.each(t.files, function (e, o) {
                f && i._resizeSupport && (r.resizeMaxWidth || r.resizeMaxHeight || r.resizeMinWidth || r.resizeMinHeight) && (u || o.size < r.resizeSourceMaxFileSize) && r.resizeSourceFileTypes.test(o.type) && (i._processing += 1, i._processing === 1 && i.element.addClass("fileupload-processing"), i._processingQueue = i._processingQueue.pipe(function () {
                    var u = n.Deferred();
                    return i._resizeImage(t.files, e, r).done(function () {
                        i._processing -= 1, i._processing === 0 && i.element.removeClass("fileupload-processing"), u.resolveWith(i)
                    }), u.promise()
                }))
            }), this._processingQueue
        },
        _create: function () {
            n.blueimp.fileupload.prototype._create.call(this), this._processing = 0, this._processingQueue = n.Deferred().resolveWith(this).promise(), this._resizeSupport = i && i(document.createElement("canvas"), n.noop)
        }
    })
}),
function (n) {
    "use strict";
    typeof define == "function" && define.amd ? define(["jquery", "tmpl", "load-image", "./jquery.fileupload-ip"], n) : n(window.jQuery, window.tmpl, window.loadImage)
}(function (n, t, i) {
    "use strict";
    var r = (n.blueimpIP || n.blueimp).fileupload;
    n.widget("blueimpUI.fileupload", r, {
        options: {
            autoUpload: 1,
            maxNumberOfFiles: undefined,
            maxFileSize: undefined,
            minFileSize: undefined,
            acceptFileTypes: /.+$/i,
            previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
            previewSourceMaxFileSize: 5e6,
            previewMaxWidth: 80,
            previewMaxHeight: 80,
            previewAsCanvas: !0,
            uploadTemplateId: "template-upload",
            downloadTemplateId: "template-download",
            dataType: "json",
            add: function (t, i) {
                var r = n(this).data("fileupload"),
                    f = r.options,
                    u = i.files;
                r._adjustMaxNumberOfFiles(-u.length), i.isAdjusted = !0, n(this).fileupload("resize", i).done(i, function () {
                    i.files.valid = i.isValidated = r._validate(u), i.context = r._renderUpload(u).appendTo(f.filesContainer).data("data", i), r._renderPreviews(u, i.context), r._forceReflow(i.context), r._transition(i.context).done(function () {
                        r._trigger("added", t, i) !== !1 && (f.autoUpload || i.autoUpload) && i.autoUpload !== !1 && i.isValidated && i.submit()
                    })
                })
            },
            send: function (t, i) {
                var r = n(this).data("fileupload");
                return !i.isValidated && (i.isAdjusted || r._adjustMaxNumberOfFiles(-i.files.length), !r._validate(i.files)) ? !1 : (i.context && i.dataType && i.dataType.substr(0, 6) === "iframe" && i.context.find(".progress").addClass(!n.support.transition && "progress-animated").find(".bar").css("width", parseInt(100, 10) + "%"), r._trigger("sent", t, i))
            },
            done: function (t, i) {
                var r = n(this).data("fileupload"),
                    u, f;
                i.context ? i.context.each(function (f) {
                    var e = n.isArray(i.result) && i.result[f] || {
                        error: "emptyResult"
                    };
                    e.error && r._adjustMaxNumberOfFiles(1), r._transition(n(this)).done(function () {
                        var f = n(this);
                        u = r._renderDownload([e]).css("height", f.height()).replaceAll(f), r._forceReflow(u), r._transition(u).done(function () {
                            i.context = n(this), r._trigger("completed", t, i)
                        })
                    })
                }) : (u = r._renderDownload(i.result).appendTo(r.options.filesContainer), r._forceReflow(u), r._transition(u).done(function () {
                    i.context = n(this), r._trigger("completed", t, i)
                }))
            },
            fail: function (t, i) {
                var r = n(this).data("fileupload"),
                    u;
                r._adjustMaxNumberOfFiles(i.files.length), i.context ? i.context.each(function (f) {
                    if (i.errorThrown !== "abort") {
                        var e = i.files[f];
                        e.error = e.error || i.errorThrown || !0, r._transition(n(this)).done(function () {
                            var f = n(this);
                            u = r._renderDownload([e]).replaceAll(f), r._forceReflow(u), r._transition(u).done(function () {
                                i.context = n(this), r._trigger("failed", t, i)
                            })
                        })
                    } else r._transition(n(this)).done(function () {
                        n(this).remove(), r._trigger("failed", t, i)
                    })
                }) : i.errorThrown !== "abort" ? (r._adjustMaxNumberOfFiles(-i.files.length), i.context = r._renderUpload(i.files).appendTo(r.options.filesContainer).data("data", i), r._forceReflow(i.context), r._transition(i.context).done(function () {
                    i.context = n(this), r._trigger("failed", t, i)
                })) : r._trigger("failed", t, i)
            },
            progress: function (n, t) {
                t.context && t.context.find(".progress .bar").css("width", parseInt(t.loaded / t.total * 100, 10) + "%")
            },
            progressall: function (t, i) {
                n(this).find(".fileupload-buttonbar .progress .bar").css("width", parseInt(i.loaded / i.total * 100, 10) + "%")
            },
            start: function (t) {
                var i = n(this).data("fileupload");
                i._transition(n(this).find(".fileupload-buttonbar .progress")).done(function () {
                    i._trigger("started", t)
                })
            },
            stop: function (t) {
                var i = n(this).data("fileupload");
                i._transition(n(this).find(".fileupload-buttonbar .progress")).done(function () {
                    n(this).find(".bar").css("width", "0%"), i._trigger("stopped", t)
                })
            },
            destroy: function (t, i) {
                var r = n(this).data("fileupload");
                i.url && n.ajax(i), r._adjustMaxNumberOfFiles(1), r._transition(i.context).done(function () {
                    n(this).remove(), r._trigger("destroyed", t, i)
                })
            }
        },
        _enableDragToDesktop: function () {
            var t = n(this),
                i = t.prop("href"),
                r = t.prop("download"),
                u = "application/octet-stream";
            t.bind("dragstart", function (n) {
                try {
                    n.originalEvent.dataTransfer.setData("DownloadURL", [u, r, i].join(":"))
                } catch (t) { }
            })
        },
        _adjustMaxNumberOfFiles: function (n) {
            typeof this.options.maxNumberOfFiles == "number" && (this.options.maxNumberOfFiles += n, this.options.maxNumberOfFiles < 1 ? this._disableFileInputButton() : this._enableFileInputButton())
        },
        _formatFileSize: function (n) {
            return typeof n != "number" ? "" : n >= 1e9 ? (n / 1e9).toFixed(2) + " GB" : n >= 1e6 ? (n / 1e6).toFixed(2) + " MB" : (n / 1e3).toFixed(2) + " KB"
        },
        _hasError: function (n) {
            return n.error ? n.error : this.options.maxNumberOfFiles < 0 ? "maxNumberOfFiles" : this.options.acceptFileTypes.test(n.type) || this.options.acceptFileTypes.test(n.name) ? this.options.maxFileSize && n.size > this.options.maxFileSize ? "maxFileSize" : typeof n.size == "number" && n.size < this.options.minFileSize ? "minFileSize" : null : "acceptFileTypes"
        },
        _validate: function (t) {
            var r = this,
                i = !!t.length;
            return n.each(t, function (n, t) {
                t.error = r._hasError(t), t.error && (i = !1)
            }), i
        },
        _renderTemplate: function (t, i) {
            if (!t) return n();
            var r = t({
                files: i,
                formatFileSize: this._formatFileSize,
                options: this.options
            });
            return r instanceof n ? r : n(this.options.templatesContainer).html(r).children()
        },
        _renderPreview: function (t, r) {
            var e = this,
                u = this.options,
                f = n.Deferred();
            return (i && i(t, function (n) {
                r.append(n), e._forceReflow(r), e._transition(r).done(function () {
                    f.resolveWith(r)
                })
            }, {
                maxWidth: u.previewMaxWidth,
                maxHeight: u.previewMaxHeight,
                canvas: u.previewAsCanvas
            }) || f.resolveWith(r)) && f
        },
        _renderPreviews: function (t, i) {
            var r = this,
                u = this.options;
            return i.find(".preview span").each(function (i, f) {
                var e = t[i];
                u.previewSourceFileTypes.test(e.type) && (n.type(u.previewSourceMaxFileSize) !== "number" || e.size < u.previewSourceMaxFileSize) && (r._processingQueue = r._processingQueue.pipe(function () {
                    var t = n.Deferred();
                    return r._renderPreview(e, n(f)).done(function () {
                        t.resolveWith(r)
                    }), t.promise()
                }))
            }), this._processingQueue
        },
        _renderUpload: function (n) {
            return this._renderTemplate(this.options.uploadTemplate, n)
        },
        _renderDownload: function (n) {
            return this._renderTemplate(this.options.downloadTemplate, n).find("a[download]").each(this._enableDragToDesktop).end()
        },
        _startHandler: function (t) {
            t.preventDefault();
            var r = n(this),
                u = r.closest(".template-upload"),
                i = u.data("data");
            i && i.submit && !i.jqXHR && i.submit() && r.prop("disabled", !0)
        },
        _cancelHandler: function (t) {
            t.preventDefault();
            var r = n(this).closest(".template-upload"),
                i = r.data("data") || {};
            i.jqXHR ? i.jqXHR.abort() : (i.errorThrown = "abort", t.data.fileupload._trigger("fail", t, i))
        },
        _deleteHandler: function (t) {
            t.preventDefault();
            var i = n(this);
            t.data.fileupload._trigger("destroy", t, {
                context: i.closest(".template-download"),
                url: i.attr("data-url"),
                type: i.attr("data-type") || "DELETE",
                dataType: t.data.fileupload.options.dataType
            })
        },
        _forceReflow: function (t) {
            this._reflow = n.support.transition && t.length && t[0].offsetWidth
        },
        _transition: function (t) {
            var r = this,
                i = n.Deferred();
            return n.support.transition && t.hasClass("fade") ? t.bind(n.support.transition.end, function (r) {
                r.target === t[0] && (t.unbind(n.support.transition.end), i.resolveWith(t))
            }).toggleClass("in") : (t.toggleClass("in"), i.resolveWith(t)), i
        },
        _initButtonBarEventHandlers: function () {
            var t = this.element.find(".fileupload-buttonbar"),
                i = this.options.filesContainer,
                r = this.options.namespace;
            t.find(".start").bind("click." + r, function (n) {
                n.preventDefault(), i.find(".start button").click()
            }), t.find(".cancel").bind("click." + r, function (n) {
                n.preventDefault(), i.find(".cancel button").click()
            }), t.find(".delete").bind("click." + r, function (n) {
                n.preventDefault(), i.find(".delete input:checked").siblings("button").click(), t.find(".toggle").prop("checked", !1)
            }), t.find(".toggle").bind("change." + r, function () {
                i.find(".delete input").prop("checked", n(this).is(":checked"))
            })
        },
        _destroyButtonBarEventHandlers: function () {
            this.element.find(".fileupload-buttonbar button").unbind("click." + this.options.namespace), this.element.find(".fileupload-buttonbar .toggle").unbind("change." + this.options.namespace)
        },
        _initEventHandlers: function () {
            r.prototype._initEventHandlers.call(this);
            var n = {
                fileupload: this
            };
            this.options.filesContainer.delegate(".start button", "click." + this.options.namespace, n, this._startHandler).delegate(".cancel button", "click." + this.options.namespace, n, this._cancelHandler).delegate(".delete button", "click." + this.options.namespace, n, this._deleteHandler), this._initButtonBarEventHandlers()
        },
        _destroyEventHandlers: function () {
            var n = this.options;
            this._destroyButtonBarEventHandlers(), n.filesContainer.undelegate(".start button", "click." + n.namespace).undelegate(".cancel button", "click." + n.namespace).undelegate(".delete button", "click." + n.namespace), r.prototype._destroyEventHandlers.call(this)
        },
        _enableFileInputButton: function () {
            this.element.find(".fileinput-button input").prop("disabled", !1).parent().removeClass("disabled")
        },
        _disableFileInputButton: function () {
            this.element.find(".fileinput-button input").prop("disabled", !0).parent().addClass("disabled")
        },
        _initTemplates: function () {
            var n = this.options;
            n.templatesContainer = document.createElement(n.filesContainer.prop("nodeName")), t && (n.uploadTemplateId && (n.uploadTemplate = t(n.uploadTemplateId)), n.downloadTemplateId && (n.downloadTemplate = t(n.downloadTemplateId)))
        },
        _initFilesContainer: function () {
            var t = this.options;
            t.filesContainer === undefined ? t.filesContainer = this.element.find(".files") : t.filesContainer instanceof n || (t.filesContainer = n(t.filesContainer))
        },
        _initSpecialOptions: function () {
            r.prototype._initSpecialOptions.call(this), this._initFilesContainer(), this._initTemplates()
        },
        _create: function () {
            r.prototype._create.call(this), this._refreshOptionsList.push("filesContainer", "uploadTemplateId", "downloadTemplateId"), n.blueimpIP || (this._processingQueue = n.Deferred().resolveWith(this).promise(), this.resize = function () {
                return this._processingQueue
            })
        },
        enable: function () {
            r.prototype.enable.call(this), this.element.find("input, button").prop("disabled", !1), this._enableFileInputButton()
        },
        disable: function () {
            this.element.find("input, button").prop("disabled", !0), this._disableFileInputButton(), r.prototype.disable.call(this)
        }
    })
}), window.locale = {
    fileupload: {
        errors: {
            maxFileSize: "File is too big",
            minFileSize: "File is too small",
            acceptFileTypes: "Filetype not allowed",
            maxNumberOfFiles: "Max number of files exceeded",
            uploadedBytes: "Uploaded bytes exceed file size",
            emptyResult: "Empty file upload result"
        },
        error: "Error",
        start: "Start",
        cancel: "Cancel",
        destroy: "Delete"
    }
}