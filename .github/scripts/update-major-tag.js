// @ts-check

/** @param {import('@actions/github-script').AsyncFunctionArguments} args */
export default async function updateMajorTag({ github, context }) {
  const tag = context.payload.release?.tag_name;
  if (!tag) {
    throw new Error("No release tag found in event payload");
  }

  const match = tag.match(/^(v\d+)\.\d+\.\d+/);
  if (!match) {
    throw new Error(`Tag "${tag}" does not match semver pattern vX.Y.Z`);
  }

  const majorTag = match[1];
  const sha = context.sha;

  const tagsToUpdate = [majorTag, "latest"];

  for (const tagName of tagsToUpdate) {
    const ref = `tags/${tagName}`;
    try {
      await github.rest.git.updateRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref,
        sha,
        force: true,
      });
      console.log(`Updated ${ref} to ${sha}`);
    } catch (error) {
      if (error?.status === 404 || error?.status === 422) {
        await github.rest.git.createRef({
          owner: context.repo.owner,
          repo: context.repo.repo,
          ref: `refs/${ref}`,
          sha,
        });
        console.log(`Created ${ref} at ${sha}`);
      } else {
        throw error;
      }
    }
  }
}
