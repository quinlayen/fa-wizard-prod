import { createClient } from "@/libs/supabase/server";

const supabase = createClient();

async function seedDummyData() {
  try {
    // Create dummy profiles
    const profiles = [
      {
        id: "dummy-user-1",
        email: "school1@example.com",
        full_name: "School One Admin",
        is_admin: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "dummy-user-2",
        email: "school2@example.com",
        full_name: "School Two Admin",
        is_admin: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "dummy-admin",
        email: "admin@example.com",
        full_name: "System Admin",
        is_admin: true,
        created_at: new Date().toISOString(),
      },
    ];

    // Create dummy schools
    const schools = [
      {
        id: "school-1",
        name: "Example High School",
        address: "123 Education St, Honolulu, HI 96815",
        phone: "(808) 555-1234",
        email: "school1@example.com",
        primary_contact_name: "John Smith",
        primary_contact_email: "john.smith@example.com",
        primary_contact_phone: "(808) 555-5678",
        secondary_contact_name: "Jane Doe",
        secondary_contact_email: "jane.doe@example.com",
        secondary_contact_phone: "(808) 555-9012",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "school-2",
        name: "Sample Preparatory Academy",
        address: "456 Learning Ave, Honolulu, HI 96816",
        phone: "(808) 555-4321",
        email: "school2@example.com",
        primary_contact_name: "Robert Johnson",
        primary_contact_email: "robert.johnson@example.com",
        primary_contact_phone: "(808) 555-8765",
        secondary_contact_name: "Mary Williams",
        secondary_contact_email: "mary.williams@example.com",
        secondary_contact_phone: "(808) 555-2109",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Insert profiles
    for (const profile of profiles) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profile);

      if (profileError) {
        console.error("Error inserting profile:", profileError);
      }
    }

    // Insert schools
    for (const school of schools) {
      const { error: schoolError } = await supabase
        .from("schools")
        .upsert(school);

      if (schoolError) {
        console.error("Error inserting school:", schoolError);
      }
    }

    console.log("Dummy data seeded successfully!");
  } catch (error) {
    console.error("Error seeding dummy data:", error);
  }
}

// Run the seed function
seedDummyData(); 