import React from "react";
import { assert } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";

describe("ComponentName", () => {
	let sandbox;
	let props;
	let mountedComponentName;
	let onClickStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		onClickStub = sandbox.stub();

		props = {
		};
		mountedComponentName = undefined;
	});

	afterEach(() => {
		if (mountedComponentName) {
			mountedComponentName.unmount();
		}

		sandbox.restore();
	});

	const componentTest = () => {
		if (!mountedComponentName) {
			mountedComponentName = mount(
				<Component1 {...props} />
			);
		}

		return mountedComponentName;
	};

	describe("test", () => {

		it("t1", () => {
			//assert.isTrue(mountedComponentName().find().exists());
		});

		it("t2", () => {
			props = {};
			//assert.equal(mountedComponentName().find().props().children, "testProp");
		});
	});
});