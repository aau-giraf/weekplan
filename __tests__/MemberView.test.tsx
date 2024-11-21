import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CutoffList } from "../components/organisationoverview_components/CutoffList";
import { UserDTO } from "../hooks/useOrganisation";

const generateMember = (index: string, email: string): UserDTO => ({
  id: index,
  email: email,
  firstName: `Member${index}`,
  lastName: `Last${index}`,
});

const citizen = [
  {
    id: 123,
    firstName: "John",
    lastName: "Doe",
  },
];

const members = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "John@doe.com",
  },
];

jest.mock("../providers/ProfilePictureUpdaterProvider", () => ({
  useProfilePictureUpdater: () => ({
    timestamp: "123",
  }),
}));

describe("MemberView Component", () => {
  it("renders the correct number of members when below MAX_DISPLAYED_MEMBERS", () => {
    const mockMembers = Array.from({ length: 5 }, (_, i) =>
      generateMember(i.toString(), i.toString() + "@mail")
    );
    render(<CutoffList entries={mockMembers} onPress={() => {}} />);

    const queriedMembers = screen.queryAllByTestId("members");
    expect(queriedMembers.length).toBe(5);
  });

  it("renders only MAX_DISPLAYED_MEMBERS when members exceed limit", () => {
    const mockMembers = Array.from({ length: 10 }, (_, i) =>
      generateMember(i.toString(), i.toString() + "@mail")
    );
    render(<CutoffList entries={mockMembers} onPress={() => {}} />);

    const memberImages = screen.queryAllByTestId("members");
    expect(memberImages.length).toBe(8);
    expect(screen.getByText("+2")).toBeTruthy();
  });

  it("Does not render profile picture when image is NOT provided", () => {
    render(<CutoffList entries={members} onPress={() => {}} />);

    const profilePicture = screen.getByTestId("members");

    expect(profilePicture.props.imageUri).toBe(undefined);
  });

  it("renders default profile picture when user id is a number", () => {
    render(<CutoffList entries={citizen} onPress={() => {}} />);

    const defaultPicture = screen.getByTestId("citizen");
    expect(defaultPicture).toBeTruthy();
    expect(screen.queryByTestId("profile-picture")).toBeNull();
  });

  it("renders profile picture when user id is a string", () => {
    render(<CutoffList entries={members} onPress={() => {}} />);

    const profilePicture = screen.getByTestId("members");
    expect(profilePicture).toBeTruthy();
    expect(screen.queryByTestId("default-picture")).toBeNull();
  });
});
