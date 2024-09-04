import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "../../services/postService";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services/serService";
import { createNotification } from "../../services/notificationService";

export default function PostDetails() {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  // console.log("got post id: ", postId);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState(null);
  // console.log("post details: ", post);

  // const handleNewComment = async (payload) => {
  //   console.log("got new comment: ", payload);
  // };

  const handleNewComment = async (payload) => {
    console.log("got new comment", payload.new);
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    // fetch post details here
    let res = await fetchPostDetails(postId);
    // console.log("got post details: ", res);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const onNewComment = async () => {
    // console.log("comment: ", commentRef.current);
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    //create comment
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      console.log("comment created successfully");
      // send notification later
      if (user.id != post.userId) {
        // send notification to other user
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "Commented on your post...",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };
        createNotification(notify);
      }
      // update post details
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
    console.log("comment created: ", res);
  };

  const onDeleteComment = async (comment) => {
    // delete comment
    console.log("deleteing comment: ", comment);
    let res = await removeComment(comment?.id);
    if (res.success) {
      // console.log("comment deleted successfully");
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
      // send notification later
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const onDeletePost = async (item) => {
    console.log("delete post: ", item);
    // delete post here
    let res = await removePost(post.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  const onEditPost = async (item) => {
    // console.log("edit post: ", item);
    router.back();
    router.push({ pathname: "newPost", params: { ...item } });
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notfound}>Post not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        shows
        VerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />

        {/* comment input */}
        <View style={styles.imputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Type Comment..."
            onChangeText={(value) => (commentRef.current = value)}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              history: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
          />

          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name="send" color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* comments list */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((comment) => (
            // <Text>Hi kaise ho</Text>
            <CommentItem
              key={comment?.id?.toString()}
              item={comment}
              onDelete={onDeleteComment}
              highlight={comment.id == commentId}
              canDelete={user.id == comment.userId || user.id == post.userId}
            />
          ))}

          {post?.comments?.length == 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be first to comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(10),
  },
  imputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notfound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.3 }],
  },
});
