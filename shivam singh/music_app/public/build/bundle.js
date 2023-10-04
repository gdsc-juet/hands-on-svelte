
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const musicList = writable([
        {
            image:"aud1.jpg",
            audio:"aud1.mp3",
            name:"soothing music",
            artist:"goodmode"
        },

        {
            image:"aud2.jpg",
            audio: "aud2.mp3",
            name:"happy music",
            artist:"goodmode"
        },

        {
            image:"aud3.jpg",
            audio:"aud3.mp3",
            name:"funny music",
            artist:"goodmode"
        },

        {
            image:"aud4.jpg",
            audio:"aud4.mp3",
            name:"dance music",
            artist:"goodmode"
        }

    ]);

    /* src\App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (102:6) {:else}
    function create_else_block(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-play");
    			add_location(i, file, 102, 7, 1989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(102:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:6) {#if playerstate == "play"}
    function create_if_block(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-pause");
    			add_location(i, file, 100, 7, 1940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(100:6) {#if playerstate == \\\"play\\\"}",
    		ctx
    	});

    	return block;
    }

    // (113:3) {#each $musicList as music,i}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h2;
    	let t1_value = /*music*/ ctx[13].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*music*/ ctx[13].artist + "";
    	let t3;
    	let t4;
    	let div2_class_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*i*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = "./files/images/" + /*music*/ ctx[13].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "avatar");
    			attr_dev(img, "class", "svelte-1kz3vhh");
    			add_location(img, file, 118, 6, 2348);
    			attr_dev(div0, "class", "avatar svelte-1kz3vhh");
    			add_location(div0, file, 117, 5, 2321);
    			attr_dev(h2, "class", "svelte-1kz3vhh");
    			add_location(h2, file, 121, 6, 2454);
    			attr_dev(p, "class", "svelte-1kz3vhh");
    			add_location(p, file, 122, 6, 2482);
    			attr_dev(div1, "class", "song-details svelte-1kz3vhh");
    			add_location(div1, file, 120, 5, 2421);

    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*i*/ ctx[15] == /*currentsongindex*/ ctx[0]
    			? 'active'
    			: '') + " svelte-1kz3vhh"));

    			add_location(div2, file, 113, 4, 2217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div2, t4);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$musicList*/ 16 && !src_url_equal(img.src, img_src_value = "./files/images/" + /*music*/ ctx[13].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$musicList*/ 16 && t1_value !== (t1_value = /*music*/ ctx[13].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$musicList*/ 16 && t3_value !== (t3_value = /*music*/ ctx[13].artist + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*currentsongindex*/ 1 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*i*/ ctx[15] == /*currentsongindex*/ ctx[0]
    			? 'active'
    			: '') + " svelte-1kz3vhh"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(113:3) {#each $musicList as music,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let audio;
    	let audio_src_value;
    	let t0;
    	let div5;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div2;
    	let h2;
    	let t2_value = /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].name + "";
    	let t2;
    	let t3;
    	let div1;
    	let button0;
    	let i0;
    	let t4;
    	let button1;
    	let t5;
    	let button2;
    	let i1;
    	let t6;
    	let div4;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*playerstate*/ ctx[1] == "play") return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = /*$musicList*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			audio = element("audio");
    			t0 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t4 = space();
    			button1 = element("button");
    			if_block.c();
    			t5 = space();
    			button2 = element("button");
    			i1 = element("i");
    			t6 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(audio.src, audio_src_value = "./files/audio/" + /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].audio)) attr_dev(audio, "src", audio_src_value);
    			audio.autoplay = "false";
    			attr_dev(audio, "class", "svelte-1kz3vhh");
    			add_location(audio, file, 81, 1, 1374);
    			if (!src_url_equal(img.src, img_src_value = "./files/images/" + /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "avatar");
    			attr_dev(img, "class", "svelte-1kz3vhh");
    			add_location(img, file, 90, 4, 1585);
    			attr_dev(div0, "class", "avatar svelte-1kz3vhh");
    			add_location(div0, file, 89, 3, 1560);
    			attr_dev(h2, "class", "svelte-1kz3vhh");
    			add_location(h2, file, 93, 4, 1710);
    			attr_dev(i0, "class", "fa fa-backward");
    			add_location(i0, file, 96, 6, 1818);
    			attr_dev(button0, "class", "svelte-1kz3vhh");
    			add_location(button0, file, 95, 5, 1787);
    			attr_dev(button1, "class", "svelte-1kz3vhh");
    			add_location(button1, file, 98, 5, 1869);
    			attr_dev(i1, "class", "fa fa-forward");
    			add_location(i1, file, 106, 6, 2079);
    			attr_dev(button2, "class", "svelte-1kz3vhh");
    			add_location(button2, file, 105, 5, 2048);
    			attr_dev(div1, "class", "controls svelte-1kz3vhh");
    			add_location(div1, file, 94, 4, 1759);
    			attr_dev(div2, "class", "song-controls");
    			add_location(div2, file, 92, 3, 1678);
    			attr_dev(div3, "class", "current-song svelte-1kz3vhh");
    			add_location(div3, file, 88, 2, 1530);
    			attr_dev(div4, "class", "song-list svelte-1kz3vhh");
    			add_location(div4, file, 111, 2, 2156);
    			attr_dev(div5, "class", "player svelte-1kz3vhh");
    			add_location(div5, file, 87, 1, 1507);
    			attr_dev(main, "class", "svelte-1kz3vhh");
    			add_location(main, file, 80, 0, 1342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, audio);
    			/*audio_binding*/ ctx[9](audio);
    			append_dev(main, t0);
    			append_dev(main, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(h2, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(button0, i0);
    			append_dev(div1, t4);
    			append_dev(div1, button1);
    			if_block.m(button1, null);
    			append_dev(div1, t5);
    			append_dev(div1, button2);
    			append_dev(button2, i1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div4, null);
    				}
    			}

    			/*main_binding*/ ctx[11](main);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*prev*/ ctx[5], false, false, false, false),
    					listen_dev(button1, "click", /*playpause*/ ctx[6], false, false, false, false),
    					listen_dev(button2, "click", /*next*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$musicList, currentsongindex*/ 17 && !src_url_equal(audio.src, audio_src_value = "./files/audio/" + /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].audio)) {
    				attr_dev(audio, "src", audio_src_value);
    			}

    			if (dirty & /*$musicList, currentsongindex*/ 17 && !src_url_equal(img.src, img_src_value = "./files/images/" + /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$musicList, currentsongindex*/ 17 && t2_value !== (t2_value = /*$musicList*/ ctx[4][/*currentsongindex*/ ctx[0]].name + "")) set_data_dev(t2, t2_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button1, null);
    				}
    			}

    			if (dirty & /*currentsongindex, setsong, $musicList*/ 273) {
    				each_value = /*$musicList*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*audio_binding*/ ctx[9](null);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			/*main_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $musicList;
    	validate_store(musicList, 'musicList');
    	component_subscribe($$self, musicList, $$value => $$invalidate(4, $musicList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let currentsongindex = 0;
    	let playerstate = "play";
    	let audioElement;
    	let mainElement;

    	function setBackground() {
    		let background = `
      radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%),
      url(/Music/Pictures/${$musicList[currentsongindex].image}) center no-repeat
      `;

    		$$invalidate(3, mainElement.style.background = background, mainElement);
    		$$invalidate(3, mainElement.style.background = "cover", mainElement);
    	}

    	onMount(function () {
    		setBackground();
    	});

    	function prev() {
    		if (currentsongindex == 0) {
    			$$invalidate(0, currentsongindex = $musicList.length - 1);
    		} else {
    			$$invalidate(0, currentsongindex = (currentsongindex - 1) % $musicList.length);
    		}

    		$$invalidate(1, playerstate = "play");
    		setBackground();
    	}

    	function playpause() {
    		if (playerstate === "play") {
    			$$invalidate(1, playerstate = "pause");
    			audioElement.pause();
    		} else {
    			$$invalidate(1, playerstate = "play");
    			const playPromise = audioElement.play();

    			if (playPromise !== null) {
    				playPromise.then(_ => {
    					
    				}).catch(error => {
    					console.log("autoplay error", error);
    				});
    			}
    		}
    	}

    	function next() {
    		$$invalidate(0, currentsongindex = (currentsongindex + 1) % $musicList.length);
    		$$invalidate(1, playerstate = "play");
    		setBackground();
    	}

    	function setsong(i) {
    		$$invalidate(0, currentsongindex = i);
    		$$invalidate(1, playerstate = "play");
    		setBackground();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function audio_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			audioElement = $$value;
    			$$invalidate(2, audioElement);
    		});
    	}

    	const click_handler = i => setsong(i);

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			mainElement = $$value;
    			$$invalidate(3, mainElement);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		musicList,
    		currentsongindex,
    		playerstate,
    		audioElement,
    		mainElement,
    		setBackground,
    		prev,
    		playpause,
    		next,
    		setsong,
    		$musicList
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentsongindex' in $$props) $$invalidate(0, currentsongindex = $$props.currentsongindex);
    		if ('playerstate' in $$props) $$invalidate(1, playerstate = $$props.playerstate);
    		if ('audioElement' in $$props) $$invalidate(2, audioElement = $$props.audioElement);
    		if ('mainElement' in $$props) $$invalidate(3, mainElement = $$props.mainElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentsongindex,
    		playerstate,
    		audioElement,
    		mainElement,
    		$musicList,
    		prev,
    		playpause,
    		next,
    		setsong,
    		audio_binding,
    		click_handler,
    		main_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
